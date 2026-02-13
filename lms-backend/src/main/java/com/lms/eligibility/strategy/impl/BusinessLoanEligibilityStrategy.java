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
public class BusinessLoanEligibilityStrategy implements LoanEligibilityStrategy {

    @Override
    public LoanType getLoanType() {
        return LoanType.BUSINESS;
    }

    @Override
    public EligibilityResult evaluate(EligibilityContext ctx) {

        List<String> passedRules = new ArrayList<>();
        List<String> failedRules = new ArrayList<>();
        int score = 0;

        boolean eligible = true;

        /* 1️ CIBIL score */
        Integer cibil = ctx.getCibilScore();
        if (cibil == null || cibil < 700) {
            failedRules.add("CIBIL score below 700");
            eligible = false;
        } else {
            score += 30;
            passedRules.add("CIBIL score ≥ 700");
        }

        /* 2 Business vintage */
        Integer vintage = ctx.getBusinessVintageYears();
        if (vintage == null || vintage < 2) {
            failedRules.add("Business vintage less than 2 years");
            eligible = false;
        } else {
            score += 30;
            passedRules.add("Business vintage ≥ 2 years");
        }

        /* 3️ GST annual turnover */
        BigDecimal turnover = ctx.getAnnualTurnover();
        BigDecimal minTurnover = new BigDecimal("2000000"); // ₹20 lakhs

        if (turnover == null) {
            failedRules.add("GST annual turnover not provided");
            eligible = false;
        }
        else if (turnover.compareTo(minTurnover) < 0) {
            failedRules.add("GST annual turnover below ₹20,00,000");
            eligible = false;
        }
        else {
            score += 40;
            passedRules.add("GST annual turnover acceptable");
        }

        /*  Final failure */
        if (!eligible) {
            return EligibilityResult.builder()
                    .eligible(false)
                    .newStatus(LoanStatus.NOT_ELIGIBLE)
                    .approvedAmount(BigDecimal.ZERO)
                    .score(score)
                    .remarks("Business loan eligibility failed")
                    .failedRules(failedRules)
                    .cibilScore(cibil)
                    .passedRules(passedRules)
                    .build();
        }

        /* ✅ Final success */
        return EligibilityResult.builder()
                .eligible(true)
                .newStatus(LoanStatus.UNDER_BRANCH_REVIEW)
                .approvedAmount(ctx.getRequestedAmount())
                .score(score)
                .cibilScore(cibil)
                .remarks("Eligible for business loan")
                .passedRules(passedRules)
                .failedRules(failedRules)
                .build();
    }
}



/*
Mandatory checks
    CIBIL score ≥ 700
    Business vintage ≥ 2 years
    GST annual turnover present

Scoring model (simple & realistic)
    CIBIL score	30
    Business vintage	30
    GST annual turnover	40
    Total	100
*/
