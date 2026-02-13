package com.lms.loan.controller;

import com.lms.auth.security.SecurityUtils;
import com.lms.loan.dto.*;
import com.lms.loan.entity.Loan;
import com.lms.loan.service.LoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;
    private final SecurityUtils securityUtils;

    public LoanController(LoanService loanService, SecurityUtils securityUtils) {
        this.loanService = loanService;
        this.securityUtils = securityUtils; //  injected by Spring
    }



    @PostMapping("/apply")
    public ResponseEntity<LoanApplicationResponse> applyLoan(
            @RequestBody LoanApplicationRequest request,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey
    ) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            idempotencyKey = UUID.randomUUID().toString();
        }

        LoanApplicationResponse response =
                loanService.applyForLoan(request, idempotencyKey);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }



    @GetMapping("/my-loans")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<LoanSummaryResponse>> getAllLoans() {
        return ResponseEntity.ok(
                loanService.getLoanSummaries(securityUtils.getCurrentUserId())
        );
    }




    @GetMapping("/{loanId}")
    public ResponseEntity<LoanDetailResponse> getLoanById(
            @PathVariable String loanId
    ) {
        return ResponseEntity.ok(
                loanService.getLoanDetails(loanId, securityUtils.getCurrentUserId())
        );
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
