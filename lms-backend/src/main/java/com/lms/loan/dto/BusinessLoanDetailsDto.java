package com.lms.loan.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BusinessLoanDetailsDto {

    private String businessName;
    private String businessType; // MSME / Retail / etc.

    private BigDecimal gstAnnualTurnover;
    private Integer businessVintageYears;

    private String proofOfBusiness;
    private String proofOfIncome;
    private String financialStatements;
    private String taxReturns;
    private String bankStatements;
}
