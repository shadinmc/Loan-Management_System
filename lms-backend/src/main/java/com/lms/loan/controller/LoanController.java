package com.lms.loan.controller;

import com.lms.auth.security.SecurityUtils;
import com.lms.common.enums.LoanType;
import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.dto.LoanResponse;
import com.lms.loan.dto.LoanResubmitResponse;
import com.lms.loan.dto.LoanTypeResponse;
import com.lms.loan.entity.Loan;
import com.lms.loan.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;
    private final SecurityUtils securityUtils;

    public LoanController(LoanService loanService, SecurityUtils securityUtils) {
        this.loanService = loanService;
        this.securityUtils = securityUtils; //  injected by Spring
    }


/*    @GetMapping("/types")
    public ResponseEntity<List<LoanTypeResponse>> getLoanTypes() {
        List<LoanTypeResponse> types = Arrays.stream(LoanType.values())
                .map(type -> new LoanTypeResponse(
                        type.name(),
                        type.getDisplayName(),
                        type.getDescription()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(types);
    }*/

    @PostMapping("/apply")
    public ResponseEntity<Loan> applyLoan(
            @RequestBody LoanApplicationRequest request,
            @RequestHeader("X-Idempotency-Key") String idempotencyKey
    ) {
        String userId = securityUtils.getCurrentUser().getId();

        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            idempotencyKey = UUID.randomUUID().toString(); // auto-generate
        }

        Loan loan = loanService.applyForLoan(request, idempotencyKey);

        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }



    @GetMapping("/my-loans")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getLoansByUserId(securityUtils.getCurrentUserId()));
    }



    @GetMapping("/{loanId}")
    public ResponseEntity<Loan> getLoanById(@PathVariable String loanId) {
        return ResponseEntity.ok(loanService.getLoanById(loanId));
    }

    @PatchMapping("/{loanId}/resubmit")
    public ResponseEntity<LoanResubmitResponse> resubmitLoan(
            @PathVariable String loanId,
            @RequestBody LoanApplicationRequest request
    ) {
        String userId = securityUtils.getCurrentUser().getId();

        Loan loan = loanService.resubmitLoan(loanId, userId, request);

        return ResponseEntity.ok(
                buildPatchResponse(loan)
        );
    }

    private LoanResubmitResponse buildPatchResponse(Loan loan) {

        Object details = switch (loan.getLoanType()) {

            case EDUCATION -> loan.getEducationLoanDetails();
            case PERSONAL -> loan.getPersonalLoanDetails();
            case BUSINESS -> loan.getBusinessLoanDetails();
            case VEHICLE -> loan.getVehicleLoanDetails();
        };

        return new LoanResubmitResponse(
                loan.getLoanId(),
                loan.getStatus(),
                details
        );
    }

}