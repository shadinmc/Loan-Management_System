package com.lms.eligibility.engine;

import com.lms.eligibility.rules.*;
import com.lms.decision.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RuleEvaluationService {

    private final RuleRepository ruleRepository;

    public RuleEvaluationResult evaluate(DecisionInput input) {

        List<RuleEntity> rules = ruleRepository.findByActiveTrue();
        RuleEvaluationResult result = new RuleEvaluationResult();
        result.setEligible(true);

        for (RuleEntity rule : rules) {
            switch (rule.getRuleType()) {

                case MIN_INCOME -> {
                    if (input.getMonthlyIncome() < rule.getMinValue()) {
                        result.setEligible(false);
                        result.getFailureReasons().add(rule.getDescription());
                    }
                }

                case MIN_CREDIT_SCORE -> {
                    if (input.getCreditScore() < rule.getMinValue()) {
                        result.setEligible(false);
                        result.getFailureReasons().add(rule.getDescription());
                    }
                }
            }
        }
        return result;
    }
}
