package com.lms.branch_manager.controller;

import com.lms.branch_manager.dto.BranchLoanReviewDetailsDto;
import com.lms.branch_manager.dto.BranchLoanPageResponse;
import com.lms.branch_manager.service.BranchManagerEligibilityService;
import com.lms.branch_manager.service.BranchManagerLoanQueryService;
import com.lms.branch_manager.service.BranchManagerLoanReviewService;
import com.lms.common.enums.LoanStatus;
import com.lms.eligibility.dto.EligibilityResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/branch/loans")
@RequiredArgsConstructor
public class BranchManagerEligibilityController {

    private final BranchManagerEligibilityService eligibilityService;
    private final BranchManagerLoanReviewService reviewService;
    private final BranchManagerLoanQueryService loanQueryService;

    @GetMapping
    public ResponseEntity<BranchLoanPageResponse> listLoans(
            @RequestParam(required = false) LoanStatus status,
            @RequestParam(required = false) Boolean emiEligible,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                loanQueryService.getLoans(status, emiEligible, page, size)
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
    public ResponseEntity<BranchLoanReviewDetailsDto> getReview(
            @PathVariable String loanId) {

        return ResponseEntity.ok(reviewService.getReviewData(loanId));
    }

}
