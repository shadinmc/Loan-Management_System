package com.lms.kyc.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.common.exception.KycNotVerifiedException;
import com.lms.common.idempotency.IdempotencyKeyService;
import com.lms.kyc.dto.KycRequest;
import com.lms.kyc.dto.KycResponse;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.enums.KycStatus;
import com.lms.kyc.repository.KycRepository;
import lombok.RequiredArgsConstructor;
import org.bson.BsonBinarySubType;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KycService {

    private final KycRepository kycRepository;
    private final IdempotencyKeyService idempotencyKeyService;
    private final SecurityUtils securityUtils; // inject bean
    private final AuditService auditService;



    // ---------------- SUBMIT KYC ----------------
    public KycResponse submitKyc(String idempotencyKey, KycRequest request) {

        String userId = securityUtils.getCurrentUserId();

        //  Idempotency check
        var existingKey = idempotencyKeyService.findByKey(idempotencyKey);
        if (existingKey.isPresent()) {
            Kyc existingKyc = kycRepository.findById(
                    existingKey.get().getResourceId()
            ).orElseThrow(() -> new RuntimeException("KYC not found"));

            return mapToResponse(existingKyc);
        }

        //  Prevent multiple KYCs per user
        if (kycRepository.existsByUserId(userId)) {
            throw new RuntimeException("KYC already submitted for this user");
        }

        //  Aadhaar / PAN uniqueness
        if (kycRepository.existsByAadhaarNumber(request.getAadhaarNumber()))
            throw new RuntimeException("Aadhaar already registered");

        if (kycRepository.existsByPanNumber(request.getPanNumber()))
            throw new RuntimeException("PAN already registered");

        //  Create KYC
        Kyc kyc = Kyc.builder()
                .userId(userId)
                .aadhaarNumber(request.getAadhaarNumber())
                .panNumber(request.getPanNumber())
                .documents((request.getDocuments()))
                .cibilScore(generateCibilScore())
                .status(KycStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Kyc savedKyc = kycRepository.save(kyc);

        auditService.log(
                userId,
                "KYC_APPLY",
                "KYC",
                savedKyc.getId(),
                request,          // raw request → will be masked
                savedKyc,         // entity → will be masked
                201,
                true
        );

        //  Store idempotency
        idempotencyKeyService.saveKey(
                idempotencyKey,
                savedKyc.getId(),
                "KYC_SUBMISSION"
        );

        return mapToResponse(savedKyc);
    }

    // ---------------- GET CURRENT USER KYC ----------------
    public KycResponse getMyKyc() {
        String userId = securityUtils.getCurrentUserId();
        Kyc kyc = kycRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "KYC not submitted")
                );
        return mapToResponse(kyc);
    }


    // ---------------- KYC GATE FOR LOANS ----------------
    public void validateKycVerified(String userId) {

        Kyc kyc = kycRepository.findByUserId(userId)
                .orElseThrow(KycNotVerifiedException::new);

        if (kyc.getStatus() == KycStatus.VERIFIED) {

            //  LOG ON FIRST DETECTION ONLY
            if (!Boolean.TRUE.equals(kyc.getApprovalAuditLogged())) {

                auditService.log(
                        "SYSTEM",
                        "KYC_APPROVED",
                        "KYC",
                        kyc.getId(),
                        Map.of("previousStatus", "PENDING"),
                        Map.of("currentStatus", "VERIFIED"),
                        200,
                        true
                );

                // mark as logged
                kyc.setApprovalAuditLogged(true);
                kycRepository.save(kyc);
            }

            return;
        }

        throw new KycNotVerifiedException();
    }



    // ---------------- CIBIL FETCH ----------------
    public Integer getCibilScore(String userId) {

        Kyc kyc = kycRepository.findByUserId(userId)
                .orElseThrow(KycNotVerifiedException::new);

        if (kyc.getStatus() != KycStatus.VERIFIED) {
            throw new KycNotVerifiedException();
        }

        return kyc.getCibilScore();
    }

    // ---------------- HELPERS ----------------
    private int generateCibilScore() {
        return 600 + new Random().nextInt(251);
    }

    private KycResponse mapToResponse(Kyc kyc) {
        return new KycResponse(
                maskAadhaar(kyc.getAadhaarNumber()),
                maskPan(kyc.getPanNumber()),
                kyc.getCibilScore(),
                kyc.getStatus()
        );
    }


    private String maskAadhaar(String a) {
        return "XXXX-XXXX-" + a.substring(8);
    }

    private String maskPan(String p) {
        return p.substring(0, 2) + "XXX" + p.substring(5);
    }
}
