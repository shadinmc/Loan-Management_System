/*
package com.lms.decision.controller;

import com.lms.decision.dto.DecisionInput;
import com.lms.decision.entity.DecisionEntity;
import com.lms.decision.service.DecisionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class DecisionController {

    private final DecisionService decisionService;

    @PostMapping("/{loanId}/decision")
    public DecisionEntity executeDecision(
            @PathVariable String loanId,
            @RequestBody DecisionInput input,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            HttpServletRequest request
    ) {
        return decisionService.executeDecision(
                loanId, input, idempotencyKey, request
        );
    }


}
*/
