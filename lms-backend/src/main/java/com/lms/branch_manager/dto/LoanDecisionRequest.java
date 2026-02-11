package com.lms.branch_manager.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public record LoanDecisionRequest(

        @NotNull
        LoanDecision decision,   // APPROVE / REJECT / CLARIFICATION

        String message           // required for reject & clarification
) {}
