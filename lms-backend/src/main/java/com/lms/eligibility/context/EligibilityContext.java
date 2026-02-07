package com.lms.eligibility.context;

import com.lms.common.enums.LoanType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;


import java.math.BigDecimal;
import java.time.Period;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityContext {

    private String userId;
    private String loanId;
    private LoanType loanType;

    private BigDecimal requestedAmount;
    private Integer tenureMonths;
    private Integer cibilScore;

    private LocalDate dateOfBirth; // SOURCE OF TRUTH

    /* Derived */
    public int getAge() {
        if (dateOfBirth == null) return 0;
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    /* Personal */
    private BigDecimal monthlyIncome;
    private String employmentType;

    /* Education */
    private BigDecimal coApplicantIncome;
    private Integer courseDurationMonths;

    /* Business */
    private BigDecimal annualTurnover;
    private Integer businessVintageYears;

    /* Vehicle */
    private BigDecimal downPaymentAmount;
    private String vehicleType;
}
