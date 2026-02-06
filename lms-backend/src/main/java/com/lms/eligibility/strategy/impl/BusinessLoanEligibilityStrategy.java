/*
package com.lms.eligibility.strategy.impl;

import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import org.springframework.stereotype.Component;

@Component
public class BusinessLoanEligibilityStrategy
        implements LoanEligibilityStrategy {

    @Override
    public EligibilityResult evaluate(EligibilityContext ctx) {

        int score = 0;

        // 1️⃣ CIBIL score (strict for business loans)
        if (ctx.getCreditScore()>= 750) score += 30;
        else if (ctx.getCreditScore() >= 700) score += 20;
        else
            return new EligibilityResult(false, 0, "Low CIBIL score");

        // 2️⃣ Business vintage
        if (ctx.getBusinessVintageYears() == null)
            return new EligibilityResult(false, score, "Business vintage missing");

        if (ctx.getBusinessVintageYears() >= 5) score += 30;
        else if (ctx.getBusinessVintageYears() >= 2) score += 20;
        else
            return new EligibilityResult(false, score, "Business too new");

        // 3️⃣ GST annual turnover
        if (ctx.getGstAnnualTurnover() == null)
            return new EligibilityResult(false, score, "GST turnover missing");

        if (ctx.getGstAnnualTurnover() >= 5000000)       // ≥ 50 lakhs
            score += 40;
        else if (ctx.getGstAnnualTurnover() >= 2000000)  // ≥ 20 lakhs
            score += 30;
        else
            return new EligibilityResult(false, score, "Low GST turnover");

        return new EligibilityResult(
                true,
                score,
                "Eligible for business loan"
        );
    }
}
*/


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
