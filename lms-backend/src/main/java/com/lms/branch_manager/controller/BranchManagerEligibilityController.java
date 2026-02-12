package com.lms.branch_manager.controller;

import com.lms.branch_manager.dto.BranchLoanReviewDto;
import com.lms.branch_manager.service.BranchManagerEligibilityService;
import com.lms.branch_manager.service.BranchManagerLoanQueryService;
import com.lms.branch_manager.service.BranchManagerLoanReviewService;
import com.lms.common.enums.LoanStatus;
import com.lms.eligibility.dto.EligibilityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branch/loans")
@RequiredArgsConstructor
public class BranchManagerEligibilityController {

    private final BranchManagerEligibilityService eligibilityService;
    private final BranchManagerLoanReviewService reviewService;
    private final BranchManagerLoanQueryService loanQueryService;

    @GetMapping
    public ResponseEntity<List<BranchLoanReviewDto>> listLoans(
            @RequestParam(required = false) LoanStatus status,
            @RequestParam(required = false) Boolean emiEligible
    ) {
        return ResponseEntity.ok(
                loanQueryService.getLoans(status, emiEligible)
        );
    }

    @PostMapping("/{loanId}/eligibility-check")
    public ResponseEntity<EligibilityResult> runEligibility(
            @PathVariable String loanId) {

        return ResponseEntity.ok(
                eligibilityService.runEligibility(loanId)
        );
    }

    @GetMapping("/{loanId}/review")
    public ResponseEntity<BranchLoanReviewDto> getReview(
            @PathVariable String loanId) {

        return ResponseEntity.ok(reviewService.getReviewData(loanId));
    }

}
