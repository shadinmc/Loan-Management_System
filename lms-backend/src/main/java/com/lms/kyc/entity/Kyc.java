package com.lms.kyc.entity;

import com.lms.kyc.enums.KycStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import org.bson.types.Binary;

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

    private List<Binary> documents;

    private Integer cibilScore;

    private KycStatus status;

    private String  rejectionReason;


    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Boolean approvalAuditLogged = false;

}
