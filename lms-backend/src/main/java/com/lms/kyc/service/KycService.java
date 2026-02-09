package com.lms.kyc.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.common.exception.KycNotVerifiedException;
import com.lms.common.idempotency.IdempotencyKeyService;
import com.lms.kyc.dto.KycRequest;
import com.lms.kyc.dto.KycResponse;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.enums.KycStatus;
import com.lms.kyc.repository.KycRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class KycService {

    private final KycRepository kycRepository;
    private final IdempotencyKeyService idempotencyKeyService;
    private final SecurityUtils securityUtils; // inject bean


    // ---------------- SUBMIT KYC ----------------
    public KycResponse submitKyc(String idempotencyKey, KycRequest request) {

        String userId = securityUtils.getCurrentUserId();

        // 1️⃣ Idempotency check
        var existingKey = idempotencyKeyService.findByKey(idempotencyKey);
        if (existingKey.isPresent()) {
            Kyc existingKyc = kycRepository.findById(
                    existingKey.get().getResourceId()
            ).orElseThrow(() -> new RuntimeException("KYC not found"));

            return mapToResponse(existingKyc);
        }

        // 2️⃣ Prevent multiple KYCs per user
        if (kycRepository.existsByUserId(userId)) {
            throw new RuntimeException("KYC already submitted for this user");
        }

        // 3️⃣ Aadhaar / PAN uniqueness
        if (kycRepository.existsByAadhaarNumber(request.getAadhaarNumber()))
            throw new RuntimeException("Aadhaar already registered");

        if (kycRepository.existsByPanNumber(request.getPanNumber()))
            throw new RuntimeException("PAN already registered");

        // 4️⃣ Create KYC
        Kyc kyc = Kyc.builder()
                .userId(userId)
                .aadhaarNumber(request.getAadhaarNumber())
                .panNumber(request.getPanNumber())
                .documents(request.getDocuments())
                .cibilScore(generateCibilScore())
                .status(KycStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Kyc savedKyc = kycRepository.save(kyc);

        // 5️⃣ Store idempotency
        idempotencyKeyService.saveKey(
                idempotencyKey,
                savedKyc.getId(),
                "KYC_SUBMISSION"
        );

        return mapToResponse(savedKyc);
    }


    // ---------------- KYC GATE FOR LOANS ----------------
    public void validateKycVerified(String userId) {

        Kyc kyc = kycRepository.findByUserId(userId)
                .orElseThrow(KycNotVerifiedException::new);

        if (kyc.getStatus() != KycStatus.VERIFIED) {
            throw new KycNotVerifiedException();
        }
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
