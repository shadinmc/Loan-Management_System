package com.lms.repayment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class OtsQuoteResponse {

    private BigDecimal outstandingPrincipal;
    private BigDecimal reducedInterest;
    private BigDecimal penaltyAmount;
    private BigDecimal penaltyWaiver;
    private BigDecimal settlementAmount;
    private int remainingMonths;
}

