package com.lms.loan.dto;

import lombok.Data;

@Data
public class PersonalLoanDetailsDto {

    private String employmentType; // SALARIED / SELF_EMPLOYED
    private Double monthlyIncome;
    private String employerName;

    private String proofOfIdentity;
    private String proofOfIncome;
    private String proofOfAddress;
}
