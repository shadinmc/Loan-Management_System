package com.lms.repayment.dto;

import com.lms.repayment.enums.RepaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@AllArgsConstructor
public class EmiViewResponse {

    private int emiNumber;
    private Instant dueDate;

    private BigDecimal emiAmount;
    private BigDecimal paidAmount;
    private BigDecimal penaltyAmount;

    private RepaymentStatus status;
}
