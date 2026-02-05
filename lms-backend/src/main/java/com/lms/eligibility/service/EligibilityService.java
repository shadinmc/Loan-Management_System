package com.lms.eligibility.service;

import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.factory.EligibilityStrategyFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EligibilityService {

    private final EligibilityStrategyFactory factory;

    public EligibilityResult checkEligibility(EligibilityContext context) {
        System.out.println("Context loanType = " + context.getLoanType());

        if (context.getLoanType() == null) {
            throw new IllegalArgumentException(
                    "loanType is required and must be one of PERSONAL, EDUCATION, BUSINESS, VEHICLE"
            );
        }

        return factory
                .getStrategy(context.getLoanType())
                .evaluate(context);
    }
}

