package com.lms.decision.mapper;

import com.lms.decision.dto.DecisionInput;
import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.context.LoanType;

public class DecisionEligibilityMapper {

    public static EligibilityContext toContext(DecisionInput input) {

        EligibilityContext ctx = new EligibilityContext();

        // ✅ THIS IS THE CRITICAL LINE
        ctx.setLoanType(input.getLoanType());

        ctx.setCreditScore(input.getCreditScore());
        ctx.setDateOfBirth(input.getDateOfBirth());

        ctx.setLoanAmount(input.getLoanAmount());
        ctx.setEmiAmount(input.getEmiAmount());
        ctx.setTenureMonths(input.getTenureMonths());

        ctx.setMonthlyIncome(input.getMonthlyIncome());
        ctx.setCoApplicantIncome(input.getCoApplicantIncome());
        ctx.setBusinessVintageYears(input.getBusinessVintageYears());
        ctx.setGstAnnualTurnover(input.getGstAnnualTurnover());
        ctx.setDownPaymentAmount(input.getDownPaymentAmount());

        return ctx;
    }
}
