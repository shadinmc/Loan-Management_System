package com.lms.regional.dto;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RegionalLoanSummaryResponse {

    private String loanId;
    private String userId;
    private String fullName;
    private String email;
    private LoanType loanType;
    private BigDecimal approvedAmount;
    private LoanStatus status;
    private LocalDateTime updatedAt;
}
