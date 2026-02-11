package com.lms.audit.service;

import com.lms.audit.entity.AuditLog;
import com.lms.audit.repository.AuditLogRepository;
import com.lms.audit.util.AuditHashUtil;
import com.lms.audit.util.AuditMaskingUtil;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuditService {

    private static final String GENESIS_HASH =
            "0000000000000000000000000000000000000000000000000000000000000000";

    private final AuditLogRepository repository;
    private final AuditSequenceService sequenceService;

    public AuditService(
            AuditLogRepository repository,
            AuditSequenceService sequenceService
    ) {
        this.repository = repository;
        this.sequenceService = sequenceService;
    }

    public void log(
            String userId,
            String action,
            String resourceType,
            String resourceId,
            Object request,
            Object response,
            int httpStatus,
            boolean success
    ) {
        // 1. Generate sequence FIRST (order matters)
        Long sequence = sequenceService.nextSequence();

        // 2. Resolve previous hash (chain link)
        String previousHash = repository
                .findTopByOrderByAuditSequenceDesc()
                .map(AuditLog::getCurrentHash)
                .orElse(GENESIS_HASH);

        // 3. Timestamp once (deterministic)
        Instant now = Instant.now();

        // 4. Mask payloads
        String requestMasked = AuditMaskingUtil.mask(request);
        String responseMasked = AuditMaskingUtil.mask(response);

        // 5. Build canonical hash input
        String hashInput = buildHashInput(
                previousHash,
                sequence,
                MDC.get("correlationId"),
                userId,
                action,
                resourceType,
                resourceId,
                requestMasked,
                responseMasked,
                httpStatus,
                success,
                now
        );

        // 6. Compute current hash
        String currentHash = AuditHashUtil.sha256(hashInput);

        // 7. Persist immutable audit log
        AuditLog log = AuditLog.builder()
                .auditSequence(sequence)
                .correlationId(MDC.get("correlationId"))
                .userId(userId)
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .requestPayloadMasked(requestMasked)
                .responsePayloadMasked(responseMasked)
                .httpStatus(httpStatus)
                .success(success)
                .createdAt(now)
                .previousHash(previousHash)
                .currentHash(currentHash)
                .build();

        repository.save(log);
    }

    /**
     * IMPORTANT:
     * - Order MUST NEVER change
     * - Delimiter must be fixed
     * - No nulls allowed (String.valueOf handles this)
     */
    private String buildHashInput(
            String previousHash,
            Long sequence,
            String correlationId,
            String userId,
            String action,
            String resourceType,
            String resourceId,
            String requestPayload,
            String responsePayload,
            int httpStatus,
            boolean success,
            Instant createdAt
    ) {
        return String.join("|",
                previousHash,
                String.valueOf(sequence),
                String.valueOf(correlationId),
                String.valueOf(userId),
                action,
                resourceType,
                resourceId,
                requestPayload,
                responsePayload,
                String.valueOf(httpStatus),
                String.valueOf(success),
                createdAt.toString()
        );
    }
}
