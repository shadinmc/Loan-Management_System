package com.lms.loan.dto;

import lombok.Data;

@Data
public class BusinessLoanDetailsDto {

    private String businessName;
    private String businessType; // MSME / Retail / etc.

    private Double gstAnnualTurnover;
    private Integer businessVintageYears;

    private String proofOfBusiness;
    private String proofOfIncome;
}
