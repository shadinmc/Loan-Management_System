package com.lms.eligibility.controller;

import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/branch/eligibility")
@RequiredArgsConstructor
public class EligibilityController {

    private final EligibilityService eligibilityService;

    // Check eligibility for an existing loan application
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER','REGIONAL_MANAGER')")
    @GetMapping("/loan/{loanId}")
    public ResponseEntity<EligibilityResult> checkLoanEligibility(@PathVariable String loanId) {
        EligibilityResult result = eligibilityService.getEligibilitySnapshot(loanId);
        return ResponseEntity.ok(result);
    }
}

