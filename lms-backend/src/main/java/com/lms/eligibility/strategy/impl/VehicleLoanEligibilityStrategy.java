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
public class VehicleLoanEligibilityStrategy implements LoanEligibilityStrategy {

    @Override
    public LoanType getLoanType() {
        return LoanType.VEHICLE;
    }

    @Override
    public EligibilityResult evaluate(EligibilityContext ctx) {

        List<String> passedRules = new ArrayList<>();
        List<String> failedRules = new ArrayList<>();
        int score = 0;

        boolean eligible = true;

        /* 1️ CIBIL score */
        Integer cibil = ctx.getCibilScore();
        if (cibil == null || cibil < 650) {
            failedRules.add("CIBIL score below 650");
            eligible = false;
        } else {
            passedRules.add("CIBIL score acceptable");
            score += (cibil >= 750) ? 30 : 20;
        }

        /* 2️ Down payment present */
        if (ctx.getDownPaymentAmount() == null) {
            failedRules.add("Down payment missing");
            eligible = false;
        }

        /* 3️ Down payment ≥ 20% */
        if (ctx.getDownPaymentAmount() != null && ctx.getRequestedAmount() != null) {
            BigDecimal minDownPayment =
                    ctx.getRequestedAmount().multiply(new BigDecimal("0.20"));

            if (ctx.getDownPaymentAmount().compareTo(minDownPayment) >= 0) {
                passedRules.add("Down payment ≥ 20%");
                score += 50;
            } else {
                failedRules.add("Down payment less than 20%");
                eligible = false;
            }
        }

        /* 4️ EMI affordability (only if still meaningful) */
        if (eligible && ctx.getRequestedAmount() != null) {
            BigDecimal emiProxyLimit =
                    ctx.getRequestedAmount().multiply(new BigDecimal("0.05"));

            if (ctx.getDownPaymentAmount().compareTo(emiProxyLimit) <= 0) {
                score += 20;
                passedRules.add("EMI affordability good");
            } else {
                score += 10;
                passedRules.add("EMI affordability acceptable");
            }
        }

        /*  Final decision */
        if (!eligible) {
            return EligibilityResult.builder()
                    .eligible(false)
                    .newStatus(LoanStatus.NOT_ELIGIBLE)
                    .approvedAmount(BigDecimal.ZERO)
                    .score(score)
                    .remarks("Vehicle loan eligibility failed")
                    .failedRules(failedRules)
                    .passedRules(passedRules)
                    .build();
        }

        return EligibilityResult.builder()
                .eligible(true)
                .newStatus(LoanStatus.UNDER_BRANCH_REVIEW)
                .approvedAmount(ctx.getRequestedAmount())
                .score(score)
                .remarks("Eligible for vehicle loan")
                .passedRules(passedRules)
                .failedRules(failedRules)
                .build();
    }

}


/*
Mandatory checks

    CIBIL score ≥ 650
    Down payment present
    Down payment ≥ 10% of loan amount

Scoring model
    CIBIL score	30
    Down payment %	50
    Loan affordability (EMI proxy)	20
    Total	100
*/
