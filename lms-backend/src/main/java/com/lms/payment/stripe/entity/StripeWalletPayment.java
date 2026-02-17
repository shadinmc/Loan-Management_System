package com.lms.payment.stripe.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "stripe_wallet_payments")
public class StripeWalletPayment {
    @Id
    private String id;

    private String userId;

    @Indexed(unique = true)
    private String paymentIntentId;

    private String method;
    private String currency;
    private BigDecimal amount;
    private String status;
    private boolean walletCredited;
    private LocalDateTime walletCreditedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
