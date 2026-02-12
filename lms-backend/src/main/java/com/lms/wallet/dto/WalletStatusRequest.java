package com.lms.wallet.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WalletStatusRequest {
    @NotNull
    private Boolean active;
}
