package com.lms.eligibility.controller;

import com.lms.auth.security.SecurityUtils;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.service.EligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eligibility")
@RequiredArgsConstructor
public class EligibilityController {

    private final EligibilityService eligibilityService;
    private final SecurityUtils securityUtils;

    // Check eligibility for an existing loan application
    @GetMapping("/loan/{loanId}")
    public ResponseEntity<EligibilityResult> checkLoanEligibility(@PathVariable String loanId) {
        String userId = securityUtils.getCurrentUserId();
        EligibilityResult result = eligibilityService.checkEligibility(loanId, userId);
        return ResponseEntity.ok(result);
    }
}
