package com.lms.repayment.controller;

import com.lms.repayment.dto.RepaymentDashboardResponse;
import com.lms.repayment.service.RepaymentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
