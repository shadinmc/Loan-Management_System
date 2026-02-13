package com.lms.regional.dto;

import com.lms.common.enums.LoanStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RegionalDecisionResponse {

    private String userId;
    private String loanId;
    private LoanStatus status;
    private BigDecimal approvedAmount;

    private LocalDateTime regionalReviewedAt;
    private String regionalRemarks;
    private Boolean regionalApproved;
}
