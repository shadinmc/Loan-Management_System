package com.lms.branch_manager.dto;

import com.lms.kyc.enums.KycStatus;
import java.time.LocalDateTime;

public record KycDecisionResponse(
        String userId,
        KycStatus status,
        String message,
        LocalDateTime reviewedAt
) {}
