package com.lms.repayment.entity;

import com.lms.repayment.enums.RepaymentStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Document(collection = "repayment_schedule")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentSchedule {

    @Id
    private String id;

    private String loanId;
    private String userId;

    private List<Emi> emis;

    /** EMI-based totals */
    private BigDecimal totalPayableAmount;
    private BigDecimal totalPaidAmount;
    private BigDecimal outstandingAmount;      // EMI remaining

    /** 🔑 PRINCIPAL tracking (NEW) */
    private BigDecimal outstandingPrincipal;   // Pure remaining principal

    private Instant nextEmiDate;
    private BigDecimal nextEmiAmount;

    private boolean closed;

    private Instant createdAt;
    private Instant updatedAt;
}
