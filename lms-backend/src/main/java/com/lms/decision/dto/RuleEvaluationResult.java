package com.lms.decision.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class RuleEvaluationResult {
    private boolean eligible;
    private List<String> failureReasons = new ArrayList<>();
}
