package com.lms.loan.dto;

import com.lms.common.enums.LoanStatus;

public record LoanResubmitResponse(
        String loanId,
        LoanStatus status,
        Object updatedDetails
) {}
