package com.lms.loan.entity.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationLoanDetails {

    private String courseName;
    private Integer courseDurationMonths;

    private String coApplicantName;
    private Double coApplicantIncome;
    private String relationship;

    private String proofOfAdmission;
    private String proofOfIncome;
    private String proofOfAddress;

    private String collateralDocuments;
}
