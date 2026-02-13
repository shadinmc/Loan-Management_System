package com.lms.repayment.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class EmiPaymentRequest {
    private BigDecimal amount;
}

