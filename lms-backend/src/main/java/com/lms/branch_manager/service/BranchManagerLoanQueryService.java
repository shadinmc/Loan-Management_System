package com.lms.branch_manager.service;

import com.lms.branch_manager.dto.BranchLoanReviewDto;
import com.lms.common.enums.LoanStatus;
import com.lms.common.exception.LoanDataIntegrityException;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.repository.KycRepository;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchManagerLoanQueryService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final KycRepository kycRepository;

    public List<BranchLoanReviewDto> getLoans(
            LoanStatus status,
            Boolean emiEligible
    ) {

        List<Loan> loans = List.of();

        if (status != null && emiEligible != null) {
            loans = loanRepository.findByStatusAndEmiEligible(status, emiEligible);
        } else if (status != null) {
            loans = loanRepository.findByStatus(status);
        } else if (emiEligible != null) {
            loans = loanRepository.findByEmiEligible(emiEligible);
        } else {
            loans = loanRepository.findAll();
        }

        return loans.stream()
                .map(this::mapToDto)
                .toList();
    }

    private BranchLoanReviewDto mapToDto(Loan loan) {

        User user = userRepository.findById(loan.getUserId())
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "User not found for loanId: " + loan.getLoanId()
                        )
                );

        Kyc kyc = kycRepository.findByUserIdWithoutDocuments(user.getId())
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "KYC not found for userId: " + user.getId()
                        )
                );



        return new BranchLoanReviewDto(
                loan.getLoanId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                "XXXX" + kyc.getPanNumber().substring(4),
                "XXXX-XXXX-" + kyc.getAadhaarNumber().substring(8),
                loan.getLoanType().name(),
                loan.getLoanAmount(),
                loan.getStatus().name(),
                loan.getEmiEligible(),
                loan.getEmiAmount(),
                loan.getAppliedDate()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
        );
    }
}
