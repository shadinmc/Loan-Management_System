package com.lms.branch_manager.dto;

import com.lms.kyc.enums.KycStatus;

import java.time.LocalDateTime;
import java.util.List;

public record PendingKycResponse(
        String userId,
        String fullName,
        String email,
        String aadhaarNumber,
        String panNumber,
        List<org.bson.types.Binary> documents,
        KycStatus status,
        LocalDateTime createdAt
) {}
