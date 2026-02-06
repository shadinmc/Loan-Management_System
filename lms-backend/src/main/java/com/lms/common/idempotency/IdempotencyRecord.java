/*
package com.lms.common.idempotency;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Duration;
import java.time.LocalDateTime;

@Data
@Document(collection = "idempotency_keys")
public class IdempotencyRecord {

    @Id
    private String id;

    @Indexed(unique = true)
    private String key;

    private String requestPath;
    private String method;
    private String referenceId;

    @Indexed(expireAfter = "PT24H") // ✅ ISO-8601 duration
    private LocalDateTime createdAt;
}
*/


package com.lms.common.idempotency;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
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

    private String resourceId;      // e.g., loanId
    private String resourceType;    // e.g., "LOAN_APPLICATION"
    private LocalDateTime createdAt;

    @Indexed(expireAfter = "PT24H")
    private LocalDateTime expiresAt;
}
