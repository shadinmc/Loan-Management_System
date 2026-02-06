/*
package com.lms.decision.service;

import com.lms.common.idempotency.IdempotencyKeyService;
import com.lms.common.idempotency.IdempotencyRecord;
import com.lms.decision.dto.*;
import com.lms.decision.entity.DecisionEntity;
import com.lms.decision.repository.DecisionRepository;
import com.lms.eligibility.engine.RuleEvaluationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DecisionService {

    private final DecisionRepository decisionRepository;
    private final RuleEvaluationService ruleEvaluationService;
    private final IdempotencyKeyService idempotencyKeyService;


    public DecisionEntity executeDecision(
            String loanId,
            DecisionInput input,
            String idempotencyKey,
            HttpServletRequest request
    ) {
        DecisionEntity decision =
                decisionRepository.findByLoanId(loanId)
                        .orElseGet(() -> {
                            RuleEvaluationResult result =
                                    ruleEvaluationService.evaluate(input);

                            DecisionEntity d = new DecisionEntity();
                            d.setLoanId(loanId);
                            d.setApproved(result.isEligible());
                            d.setReasons(result.getFailureReasons());
                            d.setDecidedAt(LocalDateTime.now());
                            return decisionRepository.save(d);
                        });

        idempotencyKeyService.register(
                idempotencyKey,
                request.getRequestURI(),
                request.getMethod(),
                loanId
        );


        return decision;
    }

}
*/
