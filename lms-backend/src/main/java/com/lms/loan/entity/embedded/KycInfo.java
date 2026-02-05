package com.lms.loan.entity.embedded;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycInfo {

    @Pattern(regexp = "\\d{12}", message = "Invalid Aadhaar")
    private String aadhaar;

    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}", message = "Invalid PAN")
    private String pan;

    @NotBlank
    private String address;

    // getters & setters
}
