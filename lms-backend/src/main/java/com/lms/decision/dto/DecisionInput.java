package com.lms.decision.dto;

import com.lms.eligibility.context.LoanType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DecisionInput {

    // ===== Common =====
    @NotNull(message = "loanType is mandatory")
    private LoanType loanType;
    private int creditScore;
    private LocalDate dateOfBirth;

    private double loanAmount;
    private double emiAmount;
    private int tenureMonths;

    // ===== Personal =====
    private Double monthlyIncome;

    // ===== Education =====
    private Double coApplicantIncome;

    // ===== Business =====
    private Integer businessVintageYears;
    private Double gstAnnualTurnover;

    // ===== Vehicle =====
    private Double downPaymentAmount;
}
