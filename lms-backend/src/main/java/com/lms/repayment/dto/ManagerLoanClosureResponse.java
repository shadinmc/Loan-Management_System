package com.lms.repayment.dto;

import com.lms.common.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@AllArgsConstructor
public class ManagerLoanClosureResponse {

    private String loanId;
    private String userId;
    private String fullName;
    private BigDecimal loanAmount;
    private BigDecimal totalPaidAmount;
    private Integer paidEmis;
    private Integer totalEmis;
    private Integer remainingMonths;
    private boolean closureEligible;
    private LoanStatus status;
    private Instant closedAt;
}
