package com.lms.eligibility.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EligibilityResult {

    private boolean eligible;     // system eligible or not
    private int score;             // 0 – 100
    private String reason;          // short system reason
}
