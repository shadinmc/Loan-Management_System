package com.lms.eligibility.controller;

import com.lms.decision.dto.DecisionInput;
import com.lms.decision.mapper.DecisionEligibilityMapper;
import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.service.EligibilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/eligibility")
@RequiredArgsConstructor
public class EligibilityController {

    private final EligibilityService eligibilityService;

    @PostMapping("/check")
    public EligibilityResult checkEligibility(@RequestBody DecisionInput input) {

        // 🔎 Hard proof
        System.out.println("Controller loanType = " + input.getLoanType());

        EligibilityContext ctx = new EligibilityContext();

        // ✅ SET IT EXPLICITLY
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

        return eligibilityService.checkEligibility(ctx);
    }
}
