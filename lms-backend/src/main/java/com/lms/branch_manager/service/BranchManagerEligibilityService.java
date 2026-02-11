package com.lms.branch_manager.service;

import com.lms.common.enums.LoanStatus;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.service.EligibilityService;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BranchManagerEligibilityService {

    private final LoanRepository loanRepository;
    private final EligibilityService eligibilityService;

    @Transactional
    public EligibilityResult runEligibility(String loanId) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.APPLIED &&
                loan.getStatus() != LoanStatus.UNDER_BRANCH_REVIEW &&
                    loan.getStatus() != LoanStatus.NOT_ELIGIBLE) {

            throw new IllegalStateException(
                    "Eligibility already processed for this loan");
        }

        // Run eligibility (your existing engine)
        EligibilityResult result =
                eligibilityService.checkEligibilityForBranch(loanId);

        // Status will be updated inside eligibility service
        return result;
    }
}
