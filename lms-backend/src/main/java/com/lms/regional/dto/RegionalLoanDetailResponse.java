package com.lms.regional.dto;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RegionalLoanDetailResponse {

    /* ---- User Info ---- */
    private String userId;
    private String userName;
    private String email;
    private String phone;

    /* ---- Loan Info ---- */
    private String loanId;
    private LoanType loanType;
    private BigDecimal approvedAmount;
    private Integer tenure;
    private LoanStatus status;

    /* ---- KYC / Meta ---- */
    private Boolean kycVerified;

}
