package com.lms.kyc.dto;

import com.lms.kyc.enums.KycStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KycResponse {

    private String aadhaarNumber; // masked
    private String panNumber;     // masked
    private Integer cibilScore;
    private KycStatus status;
    private String rejectionReason;
}
