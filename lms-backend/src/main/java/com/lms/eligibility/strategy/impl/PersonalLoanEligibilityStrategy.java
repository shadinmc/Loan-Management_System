package com.lms.eligibility.strategy.impl;

import com.lms.common.enums.LoanType;
import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import org.springframework.stereotype.Component;
import com.lms.common.enums.LoanStatus;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class PersonalLoanEligibilityStrategy implements LoanEligibilityStrategy {

    private static final int MIN_CIBIL_SCORE = 650;
    private static final BigDecimal MIN_MONTHLY_INCOME = new BigDecimal("25000");
    private static final BigDecimal MAX_LOAN_MULTIPLIER = new BigDecimal("24"); // 24x monthly income
    private static final int MIN_TENURE = 6;
    private static final int MAX_TENURE = 60;

    @Override
    public LoanType getLoanType() {
        return LoanType.PERSONAL;
    }

    @Override
    public EligibilityResult evaluate(EligibilityContext context) {
        List<String> passedRules = new ArrayList<>();
        List<String> failedRules = new ArrayList<>();
        int score = 0;

        // Rule 1: CIBIL Score check (most important)
        if (context.getCibilScore() != null && context.getCibilScore() >= MIN_CIBIL_SCORE) {
            passedRules.add("CIBIL score " + context.getCibilScore() + " meets minimum requirement of " + MIN_CIBIL_SCORE);
            score += 20;
        } else {
            failedRules.add("CIBIL score " + context.getCibilScore() + " is below minimum required " + MIN_CIBIL_SCORE);
        }


        // Rule 1: Minimum income check
        if (context.getMonthlyIncome() != null &&
                context.getMonthlyIncome().compareTo(MIN_MONTHLY_INCOME) >= 0) {
            passedRules.add("Minimum income requirement met");
            score += 20;
        } else {
            failedRules.add("Monthly income must be at least ₹25,000");
        }

        // Rule 2: Employment type check
        if ("SALARIED".equalsIgnoreCase(context.getEmploymentType()) ||
                "SELF_EMPLOYED".equalsIgnoreCase(context.getEmploymentType())) {
            passedRules.add("Valid employment type");
            score += 20;
        } else {
            failedRules.add("Employment type must be SALARIED or SELF_EMPLOYED");
        }

        // Rule 3: Tenure check
        if (context.getTenureMonths() >= MIN_TENURE && context.getTenureMonths() <= MAX_TENURE) {
            passedRules.add("Tenure within acceptable range");
            score += 20;
        } else {
            failedRules.add("Tenure must be between 6 and 60 months");
        }

        // Rule 4: Loan amount check
        BigDecimal maxEligibleAmount = context.getMonthlyIncome() != null ?
                context.getMonthlyIncome().multiply(MAX_LOAN_MULTIPLIER) : BigDecimal.ZERO;

        if (context.getRequestedAmount().compareTo(maxEligibleAmount) <= 0) {
            passedRules.add("Loan amount within eligibility");
            score += 20;
        } else {
            failedRules.add("Requested amount exceeds maximum eligible amount(24 times monthly income)");
        }

        boolean isEligible = failedRules.isEmpty();
        BigDecimal approvedAmount = isEligible ? context.getRequestedAmount() :
                maxEligibleAmount.min(context.getRequestedAmount());


        LoanStatus newStatus = isEligible
                ? LoanStatus.UNDER_BRANCH_REVIEW
                : LoanStatus.NOT_ELIGIBLE;

        return EligibilityResult.builder()
                .loanId(context.getLoanId())
                .newStatus(newStatus)
                .eligible(isEligible)
                .score(score)
                .cibilScore(context.getCibilScore())
                .requestedAmount(context.getRequestedAmount())
                .approvedAmount(isEligible ? context.getRequestedAmount() : null)
                .remarks(isEligible ? "Eligible for personal loan" : "Not eligible - check failed rules")
                .passedRules(passedRules)
                .failedRules(failedRules)
                .build();
    }
}
