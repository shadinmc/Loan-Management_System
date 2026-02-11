package com.lms.branch_manager.controller;

import com.lms.branch_manager.dto.LoanDecisionRequest;
import com.lms.branch_manager.service.BranchManagerLoanDecisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/branch/loans")
@RequiredArgsConstructor
public class BranchManagerLoanDecisionController {

    private final BranchManagerLoanDecisionService decisionService;

    @PostMapping("/{loanId}/decision")
    public ResponseEntity<Void> decideLoan(
            @PathVariable String loanId,
            @RequestBody LoanDecisionRequest request) {

        decisionService.decideLoan(loanId, request);
        return ResponseEntity.ok().build();
    }
}

