package com.lms.common.enums;

public enum LoanStatus {
    APPLIED,                    // Initial submission
    ELIGIBILITY_CHECK_PASSED,   // Eligible for review
    NOT_ELIGIBLE,               // Failed eligibility
    ELIGIBLE,                  // Eligible but not yet reviewed
    UNDER_BRANCH_REVIEW,        // Branch Manager reviewing
    BRANCH_APPROVED,            // Approved by Branch Manager
    CLARIFICATION_REQUIRED,
    BRANCH_REJECTED,            // Rejected by Branch Manager
    REJECTED,                   // Final rejection
    DISBURSED,                  // Money sent
    CLOSED,                    // Loan completed
    UNDER_REGIONAL_REVIEW,
    DISBURSEMENT_PENDING,   // waiting for time
    REGIONAL_APPROVED,
    REGIONAL_REJECTED,
}
