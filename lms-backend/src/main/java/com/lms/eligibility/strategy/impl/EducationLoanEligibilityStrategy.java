/*package com.lms.eligibility.strategy.impl;

import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import org.springframework.stereotype.Component;

@Component
public class EducationLoanEligibilityStrategy
        implements LoanEligibilityStrategy {

    @Override
    public EligibilityResult evaluate(EligibilityContext ctx) {

        int score = 0;

        // 1️⃣ CIBIL score (relaxed)
        if (ctx.getCreditScore() >= 700) score += 30;
        else if (ctx.getCreditScore() >= 600) score += 20;
        else
            return new EligibilityResult(false, 0, "Low CIBIL score");

        // 2️⃣ Course duration
        if (ctx.getTenureMonths() >= 6)
            score += 30;
        else
            return new EligibilityResult(false, score, "Course duration too short");

        // 3️⃣ Co-applicant income
        if (ctx.getCoApplicantIncome() == null)
            return new EligibilityResult(false, score, "Co-applicant income missing");

        if (ctx.getCoApplicantIncome() >= 20000)
            score += 40;
        else
            return new EligibilityResult(false, score, "Insufficient co-applicant income");

        return new EligibilityResult(
                true,
                score,
                "Eligible for education loan"
        );
    }
}*/

/*
Mandatory checks
    CIBIL score ≥ 600 (relaxed for education)
    Course duration ≥ 6 months
    Co-applicant income present

Scoring (example)
    CIBIL score	30
    Co-applicant income	40
    Course duration	30
    Total	100
*/
