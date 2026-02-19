package com.lms.branch_manager.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.branch_manager.dto.LoanDecisionRequest;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BranchManagerLoanDecisionService {

    private final LoanRepository loanRepository;
    private final AuditService auditService;
    private final SecurityUtils securityUtils;


    public void decideLoan(String loanId, LoanDecisionRequest request) {

        String actorUserId = securityUtils.getCurrentUserId();

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        LoanStatus previousStatus = loan.getStatus();

        if (previousStatus != LoanStatus.APPLIED
                && previousStatus != LoanStatus.NOT_ELIGIBLE
                && previousStatus != LoanStatus.CLARIFICATION_REQUIRED
                && previousStatus != LoanStatus.UNDER_BRANCH_REVIEW) {
            throw new IllegalStateException(
                    "Loan already decided: " + previousStatus);
        }

        switch (request.decision()) {
            case APPROVE -> {
                loan.setStatus(LoanStatus.BRANCH_APPROVED);
                loan.setDecisionMessage(null);
            }
            case REJECT -> {
                validateMessage(request.message());
                loan.setStatus(LoanStatus.BRANCH_REJECTED);
                loan.setDecisionMessage(request.message());
            }
            case CLARIFICATION_REQUIRED -> {
                validateMessage(request.message());
                loan.setStatus(LoanStatus.CLARIFICATION_REQUIRED);
                loan.setDecisionMessage(request.message());
            }
        }

        loan.setDecisionAt(Instant.now());
        loanRepository.save(loan);

        try {
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("previousStatus", previousStatus);
            requestPayload.put("decision", request.decision());

            Map<String, Object> responsePayload = new HashMap<>();
            responsePayload.put("currentStatus", loan.getStatus());
            responsePayload.put("message", loan.getDecisionMessage());

            auditService.log(
                    actorUserId,
                    "LOAN_DECISION",
                    "LOAN",
                    loanId,
                    requestPayload,
                    responsePayload,
                    200,
                    true
            );
        } catch (Exception e) {
            log.error("AUDIT FAILED — request still successful", e);
        }
    }



    private void validateMessage(String message) {
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "Message is required for this decision");
        }
    }
}


