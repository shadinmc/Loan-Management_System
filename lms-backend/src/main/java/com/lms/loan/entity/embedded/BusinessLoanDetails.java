package com.lms.loan.entity.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessLoanDetails {

    private String businessName;
    private String businessType;

    private BigDecimal gstAnnualTurnover;
    private Integer businessVintageYears;

    private String proofOfBusiness;
    private String proofOfIncome;

    private BigDecimal calculatedEligibleAmount;
}
