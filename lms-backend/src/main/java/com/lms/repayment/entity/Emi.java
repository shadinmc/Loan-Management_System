package com.lms.repayment.entity;

import com.lms.repayment.enums.RepaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Emi {

    private int emiNumber;
    private Instant dueDate;

    private BigDecimal emiAmount;
    private BigDecimal paidAmount;
    private BigDecimal penaltyAmount;

    private RepaymentStatus status;

    private Instant paidAt; // 🔑 important
    private Instant lastPenaltyAppliedAt;


}

