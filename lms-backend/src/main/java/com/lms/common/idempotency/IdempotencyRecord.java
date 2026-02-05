package com.lms.common.idempotency;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private String referenceId;   // loanId
    private LocalDateTime createdAt;
}
