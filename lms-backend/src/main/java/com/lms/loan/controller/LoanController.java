package com.lms.loan.controller;

import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.entity.Loan;
import com.lms.loan.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping
    public ResponseEntity<Loan> applyLoan(
            @RequestHeader("X-USER-ID") String userId,
            @Valid @RequestBody LoanApplicationRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(loanService.applyForLoan(userId, request));
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<Loan> getLoanById(@PathVariable String loanId) {
        return ResponseEntity.ok(loanService.getLoanById(loanId));
    }

}
