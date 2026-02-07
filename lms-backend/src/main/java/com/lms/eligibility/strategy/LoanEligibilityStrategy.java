package com.lms.eligibility.strategy;

import com.lms.common.enums.LoanType;
import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;

public interface LoanEligibilityStrategy {

    LoanType getLoanType();

    EligibilityResult evaluate(EligibilityContext context);
}
