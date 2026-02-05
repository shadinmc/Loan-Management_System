package com.lms.loan.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycInfoDto {

    @Pattern(regexp = "\\d{12}")
    private String aadhaar;

    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}")
    private String pan;

    @NotBlank
    private String address;

    // getters & setters
}
