package com.lms.user.controller;

import com.lms.auth.security.SecurityUtils;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.repository.KycRepository;
import com.lms.user.dto.UserProfileResponse;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Period;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserRepository userRepository;
    private final KycRepository kycRepository;
    private final SecurityUtils securityUtils;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        String userId = securityUtils.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Kyc kyc = kycRepository.findByUserId(userId).orElse(null);
        List<String> docs = (kyc == null || kyc.getDocuments() == null) ? Collections.emptyList() : kyc.getDocuments();

        Integer calculatedAge = user.getAge();
        if (calculatedAge == null && user.getDateOfBirth() != null) {
            calculatedAge = Period.between(user.getDateOfBirth(), LocalDate.now()).getYears();
        }

        UserProfileResponse response = UserProfileResponse.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .password("********")
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .age(calculatedAge)
                .accountCreatedTimestamp(user.getCreatedAt())
                .aadhaarNumberMasked(maskAadhaar(kyc == null ? null : kyc.getAadhaarNumber()))
                .panNumberMasked(maskPan(kyc == null ? null : kyc.getPanNumber()))
                .supportingDocuments(docs)
                .build();

        return ResponseEntity.ok(response);
    }

    private String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.length() < 4) return null;
        String lastFour = aadhaar.substring(aadhaar.length() - 4);
        return "XXXX-XXXX-" + lastFour;
    }

    private String maskPan(String pan) {
        if (pan == null || pan.length() < 2) return null;
        String upperPan = pan.toUpperCase();
        if (upperPan.length() <= 2) return upperPan;
        return upperPan.charAt(0) + "XXXXXXX" + upperPan.charAt(upperPan.length() - 1);
    }
}
