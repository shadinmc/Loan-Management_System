package com.lms.common.idempotency;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "idempotency_keys")
public class IdempotencyRecord {

    @Id
    private String id;

    @Indexed(unique = true)
    private String idempotencyKey;

    private String resourceId;      // loanId
    private String resourceType;    // LOAN_APPLICATION

    private LocalDateTime createdAt;

    // ✅ TTL handled by Mongo using absolute time
    @Indexed
    private LocalDateTime expiresAt;
}
