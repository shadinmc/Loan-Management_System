package com.lms.loan.controller;

import com.lms.auth.security.SecurityUtils;
import com.lms.common.enums.LoanType;
import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.dto.LoanTypeResponse;
import com.lms.loan.entity.Loan;
import com.lms.loan.service.LoanService;
import jakarta.validation.Valid;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/loans")
@PreAuthorize("hasRole('USER')")
public class LoanController {

    private final LoanService loanService;
    private final SecurityUtils securityUtils;

    public LoanController(LoanService loanService, SecurityUtils securityUtils) {
        this.loanService = loanService;
<<<<<<< HEAD
        this.securityUtils = securityUtils; // injected by Spring
=======
        this.securityUtils = securityUtils;
>>>>>>> 881e8dfb3d15b6bcda5a2c5e1eb71fda83e6a929
    }

    // ---------- META ----------

    @GetMapping("/types")
    public ResponseEntity<List<LoanTypeResponse>> getLoanTypes() {
        List<LoanTypeResponse> types = Arrays.stream(LoanType.values())
                .map(type -> new LoanTypeResponse(
                        type.name(),
                        type.getDisplayName(),
                        type.getDescription()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(types);
    }

    // ---------- APPLY ----------

    @PostMapping("/apply")
    public ResponseEntity<Loan> applyLoan(
            @RequestBody LoanApplicationRequest request,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @RequestHeader(value = "X-Correlation-Id", required = false) String correlationId
    ) {
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }

        MDC.put("correlationId", correlationId);

        try {
            if (idempotencyKey == null || idempotencyKey.isBlank()) {
                idempotencyKey = UUID.randomUUID().toString();
            }

            //  REAL USERNAME FROM SECURITY
            String username = securityUtils.getCurrentUsername();

            Loan loan = loanService.applyForLoan( request, idempotencyKey);
            return ResponseEntity.status(HttpStatus.CREATED).body(loan);

        } finally {
            MDC.clear();
        }
    }



    // ---------- READ ----------

    @GetMapping("/my-loans")
    public ResponseEntity<List<Loan>> getMyLoans() {
        return ResponseEntity.ok(
                loanService.getLoansByUserId(securityUtils.getCurrentUserId())
        );
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<Loan> getLoanById(@PathVariable String loanId) {
        return ResponseEntity.ok(
                loanService.getLoanByIdAndUserId(
                        loanId,
                        securityUtils.getCurrentUserId()
                )
        );
    }
}
