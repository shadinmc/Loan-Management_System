package com.lms.audit.dto;

import java.time.Instant;

public record AuditLogResponse(
        String id,
        Long auditSequence,
        String correlationId,
        String userId,
        String action,
        String resourceType,
        String resourceId,
        int httpStatus,
        boolean success,
        String requestPayloadMasked,
        String responsePayloadMasked,
        Instant createdAt
) {
}
