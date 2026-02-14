package com.lms.disbursement.dto;

import com.lms.common.enums.LoanStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

public record DisbursementResponse(
        String loanId,
        String userId,
        BigDecimal amount,
        LoanStatus status,
        Instant disbursementScheduledAt,
        Instant disbursedAt,
        Instant updatedAt,
        String transactionId,
        LocalDateTime transactionDoneAt
) {
}
