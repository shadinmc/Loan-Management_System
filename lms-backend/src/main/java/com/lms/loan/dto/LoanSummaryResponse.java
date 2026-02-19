package com.lms.loan.dto;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class LoanSummaryResponse {

    private String loanId;
    private LoanType loanType;
    private LoanStatus status;
    private String decisionMessage;
    private BigDecimal loanAmount;
    private LocalDate appliedDate;
}
