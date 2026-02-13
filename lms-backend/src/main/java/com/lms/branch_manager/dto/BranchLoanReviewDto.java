package com.lms.branch_manager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BranchLoanReviewDto(
        String loanId,
        String applicantName,
        String email,
        String phone,
        String panMasked,
        String aadhaarMasked,
        String loanType,
        BigDecimal loanAmount,
        String status,
        Boolean eligible,
        BigDecimal emiAmount,
        LocalDate appliedDate
) {}
