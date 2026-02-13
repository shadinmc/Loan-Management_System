package com.lms.branch_manager.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.common.enums.LoanStatus;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.service.EligibilityService;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BranchManagerEligibilityService {

    private final LoanRepository loanRepository;
    private final EligibilityService eligibilityService;
    private final AuditService auditService;
    private final SecurityUtils securityUtils;


    public EligibilityResult runEligibility(String loanId) {

        String actorUserId = securityUtils.getCurrentUserId();

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        LoanStatus previousStatus = loan.getStatus();

        EligibilityResult result =
                eligibilityService.checkEligibilityForBranch(loanId);

        try {
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("previousStatus", previousStatus);
            requestPayload.put("requestedLoanId", loanId);

            auditService.log(
                    actorUserId,
                    "LOAN_ELIGIBILITY_CHECK",
                    "LOAN",
                    loanId,
                    requestPayload,
                    result,
                    200,
                    true
            );
        } catch (Exception e) {
            log.error("AUDIT FAILED — request still successful", e);
        }

        return result;
    }


}
