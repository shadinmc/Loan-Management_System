package com.lms.branch_manager.dto;

import com.lms.common.enums.LoanStatus;

import java.math.BigDecimal;

public record BranchLoanReviewDto(
        String loanId,
        String applicantName,
        String email,
        String phone,
        String panMasked,
        String aadhaarMasked,
        String loanType,
        Boolean eligible,
        BigDecimal emiAmount,
        LoanStatus status
) {}
