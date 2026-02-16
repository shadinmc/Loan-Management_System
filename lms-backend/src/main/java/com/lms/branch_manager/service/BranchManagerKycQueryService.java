package com.lms.branch_manager.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.branch_manager.dto.PendingKycResponse;
import com.lms.branch_manager.dto.ManagerKycRecordResponse;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.enums.KycStatus;
import com.lms.kyc.repository.KycRepository;
import com.lms.user.repository.UserBasicProjection;
import com.lms.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BranchManagerKycQueryService {

    private final KycRepository kycRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final SecurityUtils securityUtils;



    @Transactional
    public KycStatus reviewKyc(String userId, Boolean approved, String rejectionReason) {

        String actorUserId = securityUtils.getCurrentUserId();

        Kyc kyc = kycRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("KYC not found"));

        KycStatus previousStatus = kyc.getStatus();

        if (previousStatus != KycStatus.PENDING) {
            throw new IllegalStateException(
                    "KYC already reviewed: " + previousStatus);
        }

        if (Boolean.TRUE.equals(approved)) {
            kyc.setStatus(KycStatus.VERIFIED);
            kyc.setRejectionReason(null);
        } else {
            kyc.setStatus(KycStatus.REJECTED);
            kyc.setRejectionReason(rejectionReason);
        }

        kyc.setReviewedAt(LocalDateTime.now());
        kyc.setUpdatedAt(LocalDateTime.now());
        kycRepository.save(kyc);

        try {
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("previousStatus", previousStatus);
            requestPayload.put("approved", approved);

            Map<String, Object> responsePayload = new HashMap<>();
            responsePayload.put("currentStatus", kyc.getStatus());
            responsePayload.put("rejectionReason", kyc.getRejectionReason());

            auditService.log(
                    actorUserId,
                    "KYC_DECISION",
                    "KYC",
                    kyc.getId(),
                    requestPayload,
                    responsePayload,
                    200,
                    true
            );
        } catch (Exception e) {
            log.error("AUDIT FAILED — request still successful", e);
        }

        return kyc.getStatus();
    }




    public List<PendingKycResponse> getPendingKycs() {

        return kycRepository.findByStatus(String.valueOf(KycStatus.PENDING))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ManagerKycRecordResponse> getAllKycRecords() {
        return kycRepository.findAll()
                .stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .map(this::mapToManagerResponse)
                .toList();
    }

    private PendingKycResponse mapToResponse(Kyc kyc) {

        UserBasicProjection user = userRepository
                .findProjectedById(kyc.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new PendingKycResponse(
                kyc.getUserId(),
                user.getFullName(),
                user.getEmail(),
                kyc.getAadhaarNumber(),
                kyc.getPanNumber(),
                kyc.getDocuments(),
                kyc.getStatus(),
                kyc.getCreatedAt()
        );
    }

    private ManagerKycRecordResponse mapToManagerResponse(Kyc kyc) {
        UserBasicProjection user = userRepository
                .findProjectedById(kyc.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ManagerKycRecordResponse(
                kyc.getUserId(),
                user.getFullName(),
                user.getEmail(),
                kyc.getAadhaarNumber(),
                kyc.getPanNumber(),
                kyc.getDocuments(),
                kyc.getStatus(),
                kyc.getCreatedAt(),
                kyc.getReviewedAt(),
                kyc.getRejectionReason()
        );
    }
}
