package com.lms.loan.dto;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
public class LoanApplicationResponse {

    private String loanId;
    private LoanType loanType;
    private LoanStatus status;

    private BigDecimal loanAmount;
    private Integer tenureMonths;

    private LocalDate appliedDate;

    private boolean emiEligible;
    private String message;
}
