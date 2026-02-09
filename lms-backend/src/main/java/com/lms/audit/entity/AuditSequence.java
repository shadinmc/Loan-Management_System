package com.lms.audit.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "audit_sequence")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditSequence {

    @Id
    private String id; // always "AUDIT_LOG"

    private long seq;
}
