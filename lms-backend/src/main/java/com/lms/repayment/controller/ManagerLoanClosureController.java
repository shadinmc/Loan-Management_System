package com.lms.repayment.controller;

import com.lms.repayment.dto.ManagerLoanClosureResponse;
import com.lms.repayment.service.ManagerLoanClosureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/manager/loan-closure")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('BRANCH_MANAGER','REGIONAL_MANAGER')")
public class ManagerLoanClosureController {

    private final ManagerLoanClosureService managerLoanClosureService;

    @GetMapping
    public ResponseEntity<List<ManagerLoanClosureResponse>> getLoanClosureRecords() {
        return ResponseEntity.ok(managerLoanClosureService.getLoanClosureRecords());
    }

    @PostMapping("/{loanId}/close")
    public ResponseEntity<ManagerLoanClosureResponse> closeLoan(
            @PathVariable String loanId
    ) {
        return ResponseEntity.ok(managerLoanClosureService.closeLoan(loanId));
    }
}
