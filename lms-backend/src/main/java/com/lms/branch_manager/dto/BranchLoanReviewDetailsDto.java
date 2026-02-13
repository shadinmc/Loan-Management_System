package com.lms.branch_manager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
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
) {}
