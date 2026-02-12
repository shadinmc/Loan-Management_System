package com.lms.branch_manager.service;

import com.lms.branch_manager.dto.LoanDecisionRequest;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BranchManagerLoanDecisionService {

    private final LoanRepository loanRepository;

    public void decideLoan(String loanId, LoanDecisionRequest request) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.APPLIED
                && loan.getStatus() != LoanStatus.CLARIFICATION_REQUIRED
                    && loan.getStatus() != LoanStatus.UNDER_BRANCH_REVIEW) {
            throw new IllegalStateException(
                    "Loan already decided: " + loan.getStatus());
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
    }

    private void validateMessage(String message) {
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "Message is required for this decision");
        }
    }
}

