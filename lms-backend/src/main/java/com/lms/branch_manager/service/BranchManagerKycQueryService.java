package com.lms.branch_manager.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.branch_manager.dto.PendingKycResponse;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.enums.KycStatus;
import com.lms.kyc.repository.KycRepository;
import com.lms.user.repository.UserBasicProjection;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchManagerKycQueryService {

    private final KycRepository kycRepository;
    private final UserRepository userRepository;

    @Transactional
    public KycStatus reviewKyc(String userId, Boolean approved, String rejectionReason) {

        Kyc kyc = kycRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("KYC not found"));

        if (kyc.getStatus() != KycStatus.PENDING) {
            throw new IllegalStateException(
                    "KYC already reviewed: " + kyc.getStatus());
        }

        if (Boolean.TRUE.equals(approved)) {
            kyc.setStatus(KycStatus.VERIFIED);
        } else {
            kyc.setStatus(KycStatus.REJECTED);
            kyc.setRejectionReason(rejectionReason);
        }

        kyc.setReviewedAt(LocalDateTime.now());
        kyc.setUpdatedAt(LocalDateTime.now());

        kycRepository.save(kyc);

        return kyc.getStatus();
    }


    public List<PendingKycResponse> getPendingKycs() {

        return kycRepository.findByStatus(String.valueOf(KycStatus.PENDING))
                .stream()
                .map(this::mapToResponse)
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
}
