package com.lms.config.seed;

import com.lms.eligibility.rules.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DecisionRuleDataLoader implements CommandLineRunner {

    private final RuleRepository ruleRepository;

    @Override
    public void run(String... args) {
        if (ruleRepository.count() == 0) {

            RuleEntity incomeRule = new RuleEntity();
            incomeRule.setRuleType(RuleType.MIN_INCOME);
            incomeRule.setMinValue(25000.0);
            incomeRule.setActive(true);
            incomeRule.setDescription("Minimum monthly income 25,000");

            RuleEntity creditRule = new RuleEntity();
            creditRule.setRuleType(RuleType.MIN_CREDIT_SCORE);
            creditRule.setMinValue(650.0);
            creditRule.setActive(true);
            creditRule.setDescription("Minimum credit score 650");

            ruleRepository.saveAll(List.of(incomeRule, creditRule));
        }
    }
}
