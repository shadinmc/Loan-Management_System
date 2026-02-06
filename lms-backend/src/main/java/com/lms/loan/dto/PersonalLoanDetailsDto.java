package com.lms.loan.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PersonalLoanDetailsDto {

    private String employmentType; // SALARIED / SELF_EMPLOYED
    private BigDecimal monthlyIncome;
    private String employerName;

    private String proofOfIdentity;
    private String proofOfIncome;
    private String proofOfAddress;
}
