package com.lms.wallet.entity;

import com.lms.wallet.enums.PaymentAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "wallet_transactions")
public class WalletTransaction {

    @Id
    private String id;

    private String userId;
    private String walletId;
    private String loanId;

    private BigDecimal amount;
    private PaymentAction action;
    private LocalDateTime doneAt;
}
