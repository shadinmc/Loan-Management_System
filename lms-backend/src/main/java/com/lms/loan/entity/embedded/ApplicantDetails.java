package com.lms.loan.entity.embedded;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantDetails {

    @NotBlank
    private String employmentType;

    @Positive
    private Double monthlyIncome;

    @NotBlank
    private String proofOfIdentity;

    @NotBlank
    private String proofOfIncome;

    @NotBlank
    private String proofOfAddress;

    // getters & setters
}
