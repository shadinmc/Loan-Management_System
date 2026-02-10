package com.lms.kyc.entity;

import com.lms.kyc.enums.KycStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "kyc_records")
public class Kyc {

    @Id
    private String id;

    private String userId;

    private String aadhaarNumber;
    private String panNumber;

    private List<String> documents;

    private Integer cibilScore;

    private KycStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Boolean approvalAuditLogged = false;

}
