package com.lms.loan.entity.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessLoanDetails {

    private String businessName;
    private String businessType;

    private Double gstAnnualTurnover;
    private Integer businessVintageYears;

    private String proofOfBusiness;
    private String proofOfIncome;

    private Double calculatedEligibleAmount;
}
