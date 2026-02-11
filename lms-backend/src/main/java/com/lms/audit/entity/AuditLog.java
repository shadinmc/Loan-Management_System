package com.lms.audit.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    private String id; // Mongo technical ID

    private Long auditSequence; //  NEW incremental ID

    private String correlationId;
    private String userId;

    private String action;
    private String resourceType;
    private String resourceId;

    private String requestPayloadMasked;
    private String responsePayloadMasked;

    private int httpStatus;
    private boolean success;

    private Instant createdAt;
    private String previousHash;
    private String currentHash;
}
