package com.lms.regional.service;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.regional.dto.RegionalDecisionResponse;
import com.lms.regional.dto.RegionalLoanSummaryResponse;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegionalLoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;

    // Open loan → move to UNDER_REGIONAL_REVIEW
    public Loan getLoanForReview(String loanId) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.BRANCH_APPROVED
                && loan.getStatus() != LoanStatus.UNDER_REGIONAL_REVIEW) {
            throw new IllegalStateException("Loan not ready for regional review");
        }

        if (loan.getStatus() == LoanStatus.BRANCH_APPROVED) {
            loan.setStatus(LoanStatus.UNDER_REGIONAL_REVIEW);
            loan.setUpdatedAt(Instant.now());
            return loanRepository.save(loan);
        }

        return loan;
    }

    //  Final decision
    public RegionalDecisionResponse finalizeDecision(
            String loanId,
            boolean approved,
            String remarks
    ) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.UNDER_REGIONAL_REVIEW
                && loan.getStatus() != LoanStatus.BRANCH_APPROVED) {
            throw new IllegalStateException("Loan is not under regional decision");
        }

        if (!approved && (remarks == null || remarks.isBlank())) {
            throw new IllegalArgumentException("Rejection reason is required");
        }

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
                .map(loan -> {
                    Optional<User> userOpt = userRepository.findById(loan.getUserId());
                    return RegionalLoanSummaryResponse.builder()
                            .loanId(loan.getLoanId())
                            .userId(loan.getUserId())
                            .fullName(userOpt.map(u -> u.getFullName()).orElse(loan.getUserId()))
                            .email(userOpt.map(u -> u.getEmail()).orElse("N/A"))
                            .loanType(loan.getLoanType())
                            .approvedAmount(loan.getApprovedAmount())
                            .status(loan.getStatus())
                            .updatedAt(
                                    loan.getUpdatedAt() == null
                                            ? null
                                            : loan.getUpdatedAt()
                                            .atZone(ZoneId.systemDefault())
                                            .toLocalDateTime()
                            )
                            .build();
                })
                .toList();
    }




}
