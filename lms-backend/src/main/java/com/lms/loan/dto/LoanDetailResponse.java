package com.lms.loan.dto;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class LoanDetailResponse {

    private String loanId;
    private LoanType loanType;
    private LoanStatus status;

    private BigDecimal loanAmount;
    private Integer tenureMonths;

    private BigDecimal emiAmount;
    private BigDecimal outstandingPrincipal;
    private String decisionMessage;

    private LocalDate appliedDate;
    private LocalDate approvedDate;

    private Object loanDetails; // personal / education / business / vehicle
}
