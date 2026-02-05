package com.lms.loan.dto;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LoanResponse {
    private String id;
    private String applicationNumber;
    private LoanType loanType;
    private LoanStatus status;
    private BigDecimal requestedAmount;
    private Integer tenureMonths;
    private boolean eligible;
    private Integer eligibilityScore;
    private String eligibilityReason;
    private String managerRemarks;
    private String resubmissionMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
