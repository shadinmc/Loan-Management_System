package com.lms.loan.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EducationLoanDetailsDto {

    private String courseName;
    private Integer courseDurationMonths;

    private String coApplicantName;
    private BigDecimal coApplicantIncome;
    private String relationship;

    private String proofOfAdmission;
    private String proofOfIncome;
    private String proofOfAddress;

    private String collateralDocuments; // optional
}
