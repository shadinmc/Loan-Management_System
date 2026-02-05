package com.lms.loan.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantDetailsDto {

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
