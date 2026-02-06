package com.lms.eligibility.context;

import com.lms.common.enums.LoanType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;


import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityContext {

    private String loanId;
    private LoanType loanType;
    private BigDecimal requestedAmount;
    private Integer tenureMonths;
    private Integer cibilScore;


    // Personal Loan fields
    private BigDecimal monthlyIncome;
    private String employmentType;

    // Education Loan fields
    private BigDecimal coApplicantIncome;
    private Integer courseDurationMonths;

    // Business Loan fields
    private BigDecimal annualTurnover;
    private Integer businessVintageYears;

    // Vehicle Loan fields
    private BigDecimal downPaymentAmount;
    private String vehicleType;

    // Credit Score (can be fetched from external service)
    private Integer creditScore;

    private LocalDate dateOfBirth;}
