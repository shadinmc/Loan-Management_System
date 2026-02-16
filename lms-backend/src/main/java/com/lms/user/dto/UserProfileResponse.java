package com.lms.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String email;
    private String username;
    private String password;
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private Integer age;
    private LocalDateTime accountCreatedTimestamp;
    private String aadhaarNumberMasked;
    private String panNumberMasked;
    private List<String> supportingDocuments;
}
