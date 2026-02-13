package com.lms.repayment.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OtsPaymentRequest {
    private BigDecimal amount; // must equal settlementAmount
}

