package com.lms.audit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "audit_logs")
public class AuditLog {

    @Id
    private String auditId;

    private String actorId;
    private String action;
    private String entityId;
    private LocalDateTime createdAt;
}
