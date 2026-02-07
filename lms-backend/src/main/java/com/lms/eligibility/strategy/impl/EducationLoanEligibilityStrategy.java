package com.lms.eligibility.strategy.impl;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class EducationLoanEligibilityStrategy implements LoanEligibilityStrategy {

    private static final int MIN_CIBIL = 600;
    private static final int MIN_AGE = 18;
    private static final int MAX_AGE = 35;

    private static final BigDecimal MAX_LOAN_AMOUNT =
            new BigDecimal("5000000"); // ₹50 Lakhs

    @Override
    public LoanType getLoanType() {
        return LoanType.EDUCATION;
    }

    @Override
    public EligibilityResult evaluate(EligibilityContext ctx) {

        List<String> passedRules = new ArrayList<>();
        List<String> failedRules = new ArrayList<>();
        int score = 0;

        /* 1️ CIBIL score check */
        if (ctx.getCibilScore() != null && ctx.getCibilScore() >= MIN_CIBIL) {
            passedRules.add("CIBIL score meets minimum requirement");
            score += 30;
        } else {
            failedRules.add("CIBIL score must be at least 600");
        }

        /* 2️ Age check (derived from DOB) */
        int age = ctx.getAge();
        if (age >= MIN_AGE && age <= MAX_AGE) {
            passedRules.add("Age within permitted range");
            score += 20;
        } else {
            failedRules.add("Age must be between 18 and 35");
        }

        /* 3️ Course duration check */
        if (ctx.getCourseDurationMonths() != null &&
                ctx.getCourseDurationMonths() >= 6) {
            passedRules.add("Course duration meets minimum requirement");
            score += 30;
        } else {
            failedRules.add("Course duration must be at least 6 months");
        }

        /* 4️ Co-applicant income check */
        if (ctx.getCoApplicantIncome() != null &&
                ctx.getCoApplicantIncome().compareTo(BigDecimal.ZERO) > 0) {
            passedRules.add("Co-applicant income provided");
            score += 20;
        } else {
            failedRules.add("Valid co-applicant income is required");
        }

        boolean eligible = failedRules.isEmpty();

        /* Max eligible amount = 6 years of annual income OR capped */
        BigDecimal maxEligibleAmount = BigDecimal.ZERO;
        if (eligible) {
            maxEligibleAmount = ctx.getCoApplicantIncome()
                    .multiply(BigDecimal.valueOf(12))
                    .multiply(BigDecimal.valueOf(6))
                    .min(MAX_LOAN_AMOUNT);
        }

        return EligibilityResult.builder()
                .eligible(eligible)
                .newStatus(
                        eligible
                                ? LoanStatus.PENDING_BRANCH_REVIEW
                                : LoanStatus.NOT_ELIGIBLE
                )
                .approvedAmount(
                        eligible
                                ? ctx.getRequestedAmount().min(maxEligibleAmount)
                                : BigDecimal.ZERO
                )
                .score(score)
                .remarks(
                        eligible
                                ? "Eligible for education loan"
                                : "Education loan eligibility failed"
                )
                .passedRules(passedRules)
                .failedRules(failedRules)
                .build();
    }
}
