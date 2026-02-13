package com.lms.eligibility.dto;

import com.lms.common.enums.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityResult {

    private String loanId;
    private Integer cibilScore;
    private boolean eligible;
    private int score;
    private LoanStatus newStatus;
    private BigDecimal approvedAmount;
    private BigDecimal requestedAmount;
    private String remarks;
    private List<String> failedRules;
    private List<String> passedRules;
}
