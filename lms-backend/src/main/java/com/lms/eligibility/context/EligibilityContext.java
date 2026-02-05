package com.lms.eligibility.context;

import lombok.Data;
import java.time.LocalDate;
import com.lms.eligibility.context.LoanType;

@Data
public class EligibilityContext {

    // 🔴 FULLY QUALIFIED TYPE (TEMP FIX)
/*
    private com.lms.eligibility.context.LoanType loanType;
*/

    private LoanType loanType;
    private int creditScore;
    private double loanAmount;
    private double emiAmount;
    private int tenureMonths;

    private Double monthlyIncome;
    private Double coApplicantIncome;
    private Integer businessVintageYears;
    private Double gstAnnualTurnover;
    private Double downPaymentAmount;

    private LocalDate dateOfBirth;
}
