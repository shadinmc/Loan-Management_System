package com.lms.decision.mapper;

import com.lms.decision.dto.DecisionInput;
import com.lms.eligibility.context.EligibilityContext;

import java.math.BigDecimal;

public class DecisionEligibilityMapper {

    public static EligibilityContext toContext(DecisionInput input) {

        EligibilityContext ctx = new EligibilityContext();

        /* Core */
        ctx.setLoanType(input.getLoanType());
        ctx.setCibilScore(input.getCreditScore());
        ctx.setDateOfBirth(input.getDateOfBirth());

        /* Loan basics */
        ctx.setRequestedAmount(
                toBigDecimal(input.getLoanAmount())
        );
        ctx.setTenureMonths(input.getTenureMonths());

        /* Personal Loan */
        ctx.setMonthlyIncome(
                toBigDecimal(input.getMonthlyIncome())
        );

        /* Education Loan */
        ctx.setCoApplicantIncome(
                toBigDecimal(input.getCoApplicantIncome())
        );

        /* Business Loan */
        ctx.setBusinessVintageYears(input.getBusinessVintageYears());
        ctx.setAnnualTurnover(
                toBigDecimal(input.getGstAnnualTurnover())
        );

        /* Vehicle Loan */
        ctx.setDownPaymentAmount(
                toBigDecimal(input.getDownPaymentAmount())
        );

        return ctx;
    }

    /* ✅ SAFE conversion utility */
    private static BigDecimal toBigDecimal(Double value) {
        return value == null ? null : BigDecimal.valueOf(value);
    }
}
