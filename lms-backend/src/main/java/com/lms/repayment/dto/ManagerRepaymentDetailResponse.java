package com.lms.repayment.dto;

import com.lms.common.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@AllArgsConstructor
public class ManagerRepaymentDetailResponse {

    private String loanId;
    private String userId;
    private String fullName;
    private BigDecimal totalPayableAmount;
    private BigDecimal totalPaidAmount;
    private BigDecimal outstandingAmount;
    private Integer paidEmis;
    private Integer totalEmis;
    private Integer remainingMonths;
    private Integer paidProgressPercent;
    private Instant nextEmiDate;
    private BigDecimal nextEmiAmount;
    private LoanStatus status;
    private List<ManagerEmiViewResponse> emis;
}
