package com.lms.branch_manager.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

public record BranchLoanReviewDetailsDto(
        String loanId,
        String loanType,
        String status,
        BigDecimal loanAmount,
        Integer tenureMonths,
        BigDecimal interestRate,
        BigDecimal emiAmount,
        Boolean emiEligible,
        String decisionMessage,
        LocalDate appliedDate,
        BranchApplicantDto applicant,
        List<BranchLoanDocumentDto> documents
) {

    // Secondary constructor used by your SERVICE
    public BranchLoanReviewDetailsDto(
            String loanId,
            String loanType,
            String status,
            BigDecimal loanAmount,
            Integer tenureMonths,
            BigDecimal interestRate,
            BigDecimal emiAmount,
            Boolean emiEligible,
            String decisionMessage,
            Instant appliedDate,
            BranchApplicantDto applicant,
            List<BranchLoanDocumentDto> documents
    ) {
        this(
                loanId,
                loanType,
                status,
                loanAmount,
                tenureMonths,
                interestRate,
                emiAmount,
                emiEligible,
                decisionMessage,
                appliedDate
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate(),
                applicant,
                documents
        );
    }
}
