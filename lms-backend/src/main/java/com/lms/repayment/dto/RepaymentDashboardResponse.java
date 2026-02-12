package com.lms.repayment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@AllArgsConstructor
public class RepaymentDashboardResponse {

    private String loanId;

    private BigDecimal totalPayableAmount;
    private BigDecimal totalPaidAmount;
    private BigDecimal outstandingAmount;

    private Instant nextEmiDate;
    private BigDecimal nextEmiAmount;

    private boolean closed;

    private List<EmiViewResponse> emis;
}

