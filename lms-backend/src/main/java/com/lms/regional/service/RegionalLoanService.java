package com.lms.regional.service;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.regional.dto.RegionalDecisionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionalLoanService {

    private final LoanRepository loanRepository;

    //  Dashboard list
    public List<Loan> getLoansForRegionalReview() {
        return loanRepository.findByStatus(LoanStatus.BRANCH_APPROVED);
    }

    // Open loan → move to UNDER_REGIONAL_REVIEW
    public Loan getLoanForReview(String loanId) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.BRANCH_APPROVED) {
            throw new IllegalStateException("Loan not ready for regional review");
        }

        loan.setStatus(LoanStatus.UNDER_REGIONAL_REVIEW);
        loan.setUpdatedAt(LocalDateTime.now());

        return loanRepository.save(loan);
    }

    //  Final decision
    public RegionalDecisionResponse finalizeDecision(
            String loanId,
            boolean approved,
            String remarks
    ) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setRegionalReviewedAt(LocalDateTime.now());
        loan.setRegionalRemarks(remarks);
        loan.setRegionalApproved(approved);

        if (approved) {
            loan.setStatus(LoanStatus.DISBURSEMENT_PENDING);
            loan.setDisbursementScheduledAt(LocalDateTime.now().plusMinutes(3)); // Schedule disbursement after 3 minutes for demo
        } else {
            loan.setStatus(LoanStatus.REJECTED);
            loan.setDisbursementScheduledAt(null);
        }

        loan.setUpdatedAt(LocalDateTime.now());

        Loan savedLoan = loanRepository.save(loan);

        return RegionalDecisionResponse.builder()
                .userId(savedLoan.getUserId())
                .loanId(savedLoan.getLoanId())
                .status(savedLoan.getStatus())
                .approvedAmount(savedLoan.getApprovedAmount())
                .regionalReviewedAt(savedLoan.getRegionalReviewedAt())
                .regionalRemarks(savedLoan.getRegionalRemarks())
                .regionalApproved(savedLoan.getRegionalApproved())
                .build();
    }


}
