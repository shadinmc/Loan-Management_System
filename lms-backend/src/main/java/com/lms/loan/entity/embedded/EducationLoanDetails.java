package com.lms.loan.entity.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import org.bson.types.Binary;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationLoanDetails {

    private String courseName;
    private Integer courseDurationMonths;

    private String coApplicantName;
    private BigDecimal coApplicantIncome;
    private String relationship;

    private Binary proofOfAdmission;
    private Binary proofOfIncome;
    private Binary proofOfAddress;

    private Binary collateralDocuments;
}
