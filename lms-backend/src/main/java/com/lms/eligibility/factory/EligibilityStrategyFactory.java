package com.lms.eligibility.factory;

import com.lms.common.enums.LoanType;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


import java.util.Map;

@Component
@RequiredArgsConstructor
public class EligibilityStrategyFactory {

    private final Map<String, LoanEligibilityStrategy> strategies;

    public LoanEligibilityStrategy getStrategy(LoanType loanType) {

        return switch (loanType) {
            case PERSONAL ->
                    strategies.get("personalLoanEligibilityStrategy");
            case EDUCATION ->
                    strategies.get("educationLoanEligibilityStrategy");
            case BUSINESS ->
                    strategies.get("businessLoanEligibilityStrategy");
            case VEHICLE ->
                    strategies.get("vehicleLoanEligibilityStrategy");
        };
    }
}
