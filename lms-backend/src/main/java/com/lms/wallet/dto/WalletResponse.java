package com.lms.wallet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class WalletResponse {

    private String walletId;
    private String userId;
    private BigDecimal balance;
    private Boolean active;
    private LocalDateTime updatedAt;
}
