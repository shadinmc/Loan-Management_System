package com.lms.branch_manager.service;


import com.lms.branch_manager.dto.BranchLoanReviewDto;
import com.lms.common.exception.LoanDataIntegrityException;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.repository.KycRepository;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BranchManagerLoanReviewService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final KycRepository kycRepository;

    public BranchLoanReviewDto getReviewData(String loanId) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "Loan not found for loanId: " + loanId
                        )
                );

        User user = userRepository.findById(loan.getUserId())
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "User not found for loanId: " + loan.getLoanId()
                        )
                );

        Kyc kyc = kycRepository.findByUserId(user.getId())
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
                loan.getEmiEligible(),
                loan.getEmiAmount()
        );
    }
}

