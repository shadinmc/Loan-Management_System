package com.lms.common.enums;

public enum LoanStatus {
    APPLIED,                    // Initial submission
    ELIGIBILITY_CHECK_PASSED,   // Eligible for review
    NOT_ELIGIBLE,               // Failed eligibility
    ELIGIBLE,
    PENDING_BRANCH_REVIEW,      // Waiting for Branch Manager
    UNDER_BRANCH_REVIEW,        // Branch Manager reviewing
    BRANCH_APPROVED,            // Approved by Branch Manager
    CLARIFICATION_REQUIRED,
    BRANCH_REJECTED,            // Rejected by Branch Manager
    PENDING_REGIONAL_REVIEW,    // Waiting for Regional Manager
    APPROVED,                   // Final approval
    REJECTED,                   // Final rejection
    DISBURSED,                  // Money sent
    CLOSED                      // Loan completed
}
