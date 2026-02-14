package com.lms.repayment.controller;

import com.lms.repayment.dto.RepaymentDashboardResponse;
import com.lms.repayment.dto.ManagerRepaymentDetailResponse;
import com.lms.repayment.dto.ManagerRepaymentSummaryResponse;
import com.lms.repayment.service.RepaymentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/repayments")
@RequiredArgsConstructor
public class RepaymentDashboardController {

    private final RepaymentDashboardService dashboardService;

    @GetMapping("/{loanId}")
    public ResponseEntity<RepaymentDashboardResponse> getMyRepayment(
            @PathVariable String loanId
    ) {
        return ResponseEntity.ok(
                dashboardService.getMyLoanRepayment(loanId)
        );
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER','REGIONAL_MANAGER')")
    public ResponseEntity<List<ManagerRepaymentSummaryResponse>> getManagerRepayments() {
        return ResponseEntity.ok(dashboardService.getManagerRepaymentSummaries());
    }

    @GetMapping("/manager/{loanId}")
    @PreAuthorize("hasAnyRole('BRANCH_MANAGER','REGIONAL_MANAGER')")
    public ResponseEntity<ManagerRepaymentDetailResponse> getManagerRepaymentDetail(
            @PathVariable String loanId
    ) {
        return ResponseEntity.ok(dashboardService.getLoanRepaymentForManager(loanId));
    }
}
