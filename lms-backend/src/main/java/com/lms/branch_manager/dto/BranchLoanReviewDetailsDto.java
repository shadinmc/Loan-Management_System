package com.lms.branch_manager.dto;

import java.math.BigDecimal;
import java.time.Instant;
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
) {

    public BranchLoanReviewDetailsDto(String loanId2, String name, String name2, BigDecimal loanAmount2,
            Integer tenureMonths2, BigDecimal interestRate2, BigDecimal emiAmount2, Boolean emiEligible2,
            String decisionMessage2, Instant appliedDate2, BranchApplicantDto applicant2,
            List<BranchLoanDocumentDto> documents2) {
        //TODO Auto-generated constructor stub
    }}
