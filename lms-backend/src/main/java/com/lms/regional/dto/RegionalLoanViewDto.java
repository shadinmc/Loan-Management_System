package com.lms.regional.dto;

import com.lms.common.enums.LoanStatus;

import java.math.BigDecimal;

public class RegionalLoanViewDto {
    private String loanId;
    private String applicantName;
    private String loanType;
    private BigDecimal loanAmount;
    private BigDecimal approvedAmount;
    private Integer eligibilityScore;
    private LoanStatus status;
}

