package com.lms.loan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoanTypeResponse {
    private String code;
    private String displayName;
    private String description;
}
