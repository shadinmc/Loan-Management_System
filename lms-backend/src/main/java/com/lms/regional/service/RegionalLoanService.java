package com.lms.regional.service;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.regional.dto.RegionalDecisionResponse;
import com.lms.regional.dto.RegionalLoanSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionalLoanService {

    private final LoanRepository loanRepository;

    // Open loan → move to UNDER_REGIONAL_REVIEW
    public Loan getLoanForReview(String loanId) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.BRANCH_APPROVED) {
            throw new IllegalStateException("Loan not ready for regional review");
        }

        loan.setStatus(LoanStatus.UNDER_REGIONAL_REVIEW);
        loan.setUpdatedAt(Instant.now());

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

        loan.setRegionalReviewedAt(Instant.now());
        loan.setRegionalRemarks(remarks);
        loan.setRegionalApproved(approved);

        if (approved) {
            loan.setStatus(LoanStatus.DISBURSEMENT_PENDING);
            loan.setDisbursementScheduledAt(Instant.now().plusSeconds(60));
        } else {
            loan.setStatus(LoanStatus.REJECTED);
            loan.setDisbursementScheduledAt(null);
        }

        loan.setUpdatedAt(Instant.now());

        Loan savedLoan = loanRepository.save(loan);

        return RegionalDecisionResponse.builder()
                .userId(savedLoan.getUserId())
                .loanId(savedLoan.getLoanId())
                .status(savedLoan.getStatus())
                .approvedAmount(savedLoan.getApprovedAmount())
                .regionalReviewedAt(
                        savedLoan.getRegionalReviewedAt() == null
                                ? null
                                : savedLoan.getRegionalReviewedAt()
                                .atZone(ZoneId.systemDefault())
                                .toLocalDateTime()
                )
                .regionalRemarks(savedLoan.getRegionalRemarks())
                .regionalApproved(savedLoan.getRegionalApproved())
                .build();
    }



    public List<RegionalLoanSummaryResponse> getLoansForRegionalReview() {
        return loanRepository.findByStatus(LoanStatus.BRANCH_APPROVED)
                .stream()
                .map(loan -> RegionalLoanSummaryResponse.builder()
                        .loanId(loan.getLoanId())
                        .userId(loan.getUserId())
                        .approvedAmount(loan.getApprovedAmount())
                        .status(loan.getStatus())
                        .updatedAt(
                                loan.getUpdatedAt() == null
                                        ? null
                                        : loan.getUpdatedAt()
                                        .atZone(ZoneId.systemDefault())
                                        .toLocalDateTime()
                        )
                        .build()
                )
                .toList();
    }




}
