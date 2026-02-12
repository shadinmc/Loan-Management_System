package com.lms.regional.controller;

import com.lms.loan.entity.Loan;
import com.lms.regional.dto.RegionalDecisionRequest;
import com.lms.regional.dto.RegionalDecisionResponse;
import com.lms.regional.service.RegionalLoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regional/loans")
//@PreAuthorize("hasRole('REGIONAL_MANAGER')")
@RequiredArgsConstructor
public class RegionalLoanController {

    private final RegionalLoanService regionalLoanService;

    @GetMapping("/pending")
    public List<Loan> getPendingLoans() {
        System.out.println("AUTHORITIES: " +
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getAuthorities()
        );
        return regionalLoanService.getLoansForRegionalReview();
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

