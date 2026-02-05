package com.lms.decision.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DecisionResult {

    private boolean approved;
    private String message;
    private Object details;
    private int eligibilityScore;

    public static DecisionResult approved(int score) {
        return new DecisionResult(
                true,
                "Approved",
                null,
                score
        );
    }

    public static DecisionResult rejected(
            String message,
            Object details,
            int score
    ) {
        return new DecisionResult(
                false,
                message,
                details,
                score
        );
    }
}

