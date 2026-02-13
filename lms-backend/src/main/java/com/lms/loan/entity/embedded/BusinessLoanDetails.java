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
public class BusinessLoanDetails {

    private String businessName;
    private String businessType;

    private BigDecimal gstAnnualTurnover;
    private Integer businessVintageYears;

    private Binary proofOfBusiness;
    private Binary proofOfIncome;

    private BigDecimal calculatedEligibleAmount;
}
