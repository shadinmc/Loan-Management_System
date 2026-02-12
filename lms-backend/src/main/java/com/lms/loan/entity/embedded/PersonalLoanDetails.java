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
public class PersonalLoanDetails {

    private String employmentType; // SALARIED / SELF_EMPLOYED
    private BigDecimal monthlyIncome;
    private String employerName;

    private Binary proofOfIdentity;
    private Binary proofOfIncome;
    private Binary proofOfAddress;

    private String applicationStatus; // SUBMITTED / VERIFIED
}
