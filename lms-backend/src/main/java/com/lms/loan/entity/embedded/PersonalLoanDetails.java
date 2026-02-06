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
public class PersonalLoanDetails {

    private String employmentType; // SALARIED / SELF_EMPLOYED
    private BigDecimal monthlyIncome;
    private String employerName;

    private String proofOfIdentity;
    private String proofOfIncome;
    private String proofOfAddress;

    private String applicationStatus; // SUBMITTED / VERIFIED
}
