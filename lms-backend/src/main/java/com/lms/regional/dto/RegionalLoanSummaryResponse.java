package com.lms.regional.dto;

import com.lms.common.enums.LoanStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RegionalLoanSummaryResponse {

    private String loanId;
    private String userId;
    private BigDecimal approvedAmount;
    private LoanStatus status;
    private LocalDateTime updatedAt;
}
