package com.lms.wallet.dto;

import com.lms.wallet.enums.PaymentAction;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class WalletTransactionResponse {

    private String transactionId;
    private String walletId;
    private String userId;
    private String loanId;
    private BigDecimal amount;
    private PaymentAction action;
    private LocalDateTime doneAt;
}
