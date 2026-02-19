package com.lms.repayment.controller;

import com.lms.repayment.dto.ManagerLoanClosurePageResponse;
import com.lms.repayment.dto.ManagerLoanClosureResponse;
import com.lms.repayment.service.ManagerLoanClosureService;
import com.lms.repayment.service.RepaymentTotalBackfillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/manager/loan-closure")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('BRANCH_MANAGER','REGIONAL_MANAGER')")
public class ManagerLoanClosureController {

    private final ManagerLoanClosureService managerLoanClosureService;
    private final RepaymentTotalBackfillService repaymentTotalBackfillService;

    @GetMapping
    public ResponseEntity<ManagerLoanClosurePageResponse> getLoanClosureRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(managerLoanClosureService.getLoanClosureRecords(page, size));
    }

    @PostMapping("/{loanId}/close")
    public ResponseEntity<ManagerLoanClosureResponse> closeLoan(
            @PathVariable String loanId
    ) {
        return ResponseEntity.ok(managerLoanClosureService.closeLoan(loanId));
    }

    @PostMapping("/backfill-totals")
    public ResponseEntity<Map<String, Object>> backfillTotals(
            @RequestParam(defaultValue = "false") boolean dryRun
    ) {
        return ResponseEntity.ok(repaymentTotalBackfillService.backfillClosedTotals(dryRun));
    }
}
