package com.lms.repayment.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "repayments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Repayment {

    @Id
    private String id;

    private String loanId;

    private Integer emiNumber;

    private BigDecimal amountPaid;
    private BigDecimal principalComponent;
    private BigDecimal interestComponent;

    private BigDecimal remainingPrincipal;

    private LocalDateTime paidAt;

    private String transactionId;
}
