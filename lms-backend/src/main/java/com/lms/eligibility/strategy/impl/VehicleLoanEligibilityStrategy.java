package com.lms.eligibility.strategy.impl;

import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import org.springframework.stereotype.Component;

@Component
public class VehicleLoanEligibilityStrategy
        implements LoanEligibilityStrategy {

    @Override
    public EligibilityResult evaluate(EligibilityContext ctx) {

        int score = 0;

        // 1️⃣ CIBIL score
        if (ctx.getCreditScore() >= 750) score += 30;
        else if (ctx.getCreditScore() >= 650) score += 20;
        else
            return new EligibilityResult(false, 0, "Low CIBIL score");

        // 2️⃣ Down payment
        if (ctx.getDownPaymentAmount() == null)
            return new EligibilityResult(false, score, "Down payment missing");

        double minDownPayment = ctx.getLoanAmount() * 0.20;

        if (ctx.getDownPaymentAmount() >= minDownPayment)
            score += 50;
        else
            return new EligibilityResult(
                    false,
                    score,
                    "Down payment less than 20%"
            );

        // 3️⃣ EMI affordability (basic proxy)
        if (ctx.getEmiAmount() <= ctx.getLoanAmount() * 0.05)
            score += 20;
        else
            score += 10; // still acceptable, but higher risk

        return new EligibilityResult(
                true,
                score,
                "Eligible for vehicle loan"
        );
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
