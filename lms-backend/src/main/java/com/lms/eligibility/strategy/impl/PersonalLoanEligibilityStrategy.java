package com.lms.eligibility.strategy.impl;

import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

@Component
public class PersonalLoanEligibilityStrategy
        implements LoanEligibilityStrategy {

    @Override
    public EligibilityResult evaluate(EligibilityContext ctx) {

        int score = 0;

        // 1️⃣ CIBIL
        if (ctx.getCreditScore() >= 750) score += 40;
        else if (ctx.getCreditScore() >= 650) score += 30;
        else
            return new EligibilityResult(false, 0, "Low CIBIL score");

        // 2️⃣ Income vs EMI
        if (ctx.getMonthlyIncome() == null)
            return new EligibilityResult(false, score, "Monthly income missing");

        if (ctx.getMonthlyIncome() >= ctx.getEmiAmount() * 3)
            score += 30;
        else
            return new EligibilityResult(false, score, "Insufficient income");

        // 3️⃣ Age
        int age = Period.between(
                ctx.getDateOfBirth(),
                LocalDate.now()
        ).getYears();

        if (age >= 21 && age <= 60)
            score += 30;
        else
            return new EligibilityResult(false, score, "Age not eligible");

        return new EligibilityResult(true, score, "Eligible for personal loan");
    }
}

/*
Income >= 3x EMI
Age 21-60

 */