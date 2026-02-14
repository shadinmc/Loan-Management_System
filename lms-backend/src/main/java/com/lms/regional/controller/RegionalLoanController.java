package com.lms.regional.controller;

import com.lms.loan.entity.Loan;
import com.lms.regional.dto.RegionalDecisionRequest;
import com.lms.regional.dto.RegionalDecisionResponse;
import com.lms.regional.dto.RegionalLoanPageResponse;
import com.lms.regional.service.RegionalLoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/regional/loans")
@PreAuthorize("hasRole('REGIONAL_MANAGER')")
@RequiredArgsConstructor
public class RegionalLoanController {

    private final RegionalLoanService regionalLoanService;

    @GetMapping("/pending")
    public RegionalLoanPageResponse getPendingLoans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return regionalLoanService.getLoansForRegionalReview(page, size);
    }

    @GetMapping("/{loanId}")
    public Loan getLoanForReview(@PathVariable String loanId) {
        return regionalLoanService.getLoanForReview(loanId);
    }

    @PostMapping("/{loanId}/decision")
    public RegionalDecisionResponse finalizeDecision(
            @PathVariable String loanId,
            @RequestBody RegionalDecisionRequest request) {

        return regionalLoanService.finalizeDecision(
                loanId,
                request.getApproved(),
                request.getRemarks()
        );
    }
}
