package com.lms.loan.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ApplicantDetailsDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;
    private String state;
    private String pincode;

    @NotBlank(message = "Employment type is required")
    private String employmentType; // SALARIED, SELF_EMPLOYED, BUSINESS

    private String employerName;

    @NotNull(message = "Monthly income is required")
    @Positive(message = "Monthly income must be positive")
    private BigDecimal monthlyIncome;

    private BigDecimal existingEmi;

    @NotNull(message = "Credit score is required")
    @Min(value = 300, message = "Credit score minimum is 300")
    @Max(value = 900, message = "Credit score maximum is 900")
    private Integer creditScore;
}
