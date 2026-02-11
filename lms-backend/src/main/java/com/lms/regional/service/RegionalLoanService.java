package com.lms.regional.service;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
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
        return loanRepository.findByStatus(LoanStatus.PENDING_REGIONAL_REVIEW);
    }

    // Open loan → move to UNDER_REGIONAL_REVIEW
    public Loan getLoanForReview(String loanId) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.PENDING_REGIONAL_REVIEW) {
            throw new IllegalStateException("Loan not ready for regional review");
        }

        loan.setStatus(LoanStatus.UNDER_REGIONAL_REVIEW);
        loan.setUpdatedAt(LocalDateTime.now());

        return loanRepository.save(loan);
    }

    //  Final decision
    public Loan finalizeDecision(
            String loanId,
            boolean approved,
            String remarks,
            String regionalManagerId
    ) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));




        //  Regional audit fields
        loan.setRegionalManagerId(regionalManagerId);
        loan.setRegionalReviewedAt(LocalDateTime.now());
        loan.setRegionalRemarks(remarks);
        loan.setRegionalApproved(approved);

        // Final system status
        if (approved) {
            loan.setStatus(LoanStatus.DISBURSEMENT_PENDING);

            // Schedule disbursement (+1 hour)
            loan.setDisbursementScheduledAt(
                    LocalDateTime.now().plusHours(1)
            );
        } else {
            loan.setStatus(LoanStatus.REJECTED);
            loan.setDisbursementScheduledAt(null);
        }


        loan.setUpdatedAt(LocalDateTime.now());

        return loanRepository.save(loan);
    }

}
