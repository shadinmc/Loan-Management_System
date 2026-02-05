package com.lms.eligibility.strategy;

import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;

public interface LoanEligibilityStrategy {

    EligibilityResult evaluate(EligibilityContext context);
}
