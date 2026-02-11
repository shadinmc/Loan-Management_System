package com.lms.branch_manager.dto;

import jakarta.validation.constraints.NotNull;

public record KycReviewRequest(
        @NotNull Boolean approved,
        String rejectionReason
) {}
