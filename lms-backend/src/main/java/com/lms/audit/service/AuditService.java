package com.lms.audit.service;

import com.lms.audit.entity.AuditLog;
import com.lms.audit.repository.AuditLogRepository;
import com.lms.audit.util.AuditHashUtil;
import com.lms.audit.util.AuditMaskingUtil;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
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

        // 1. Generate sequence
        Long sequence = sequenceService.nextSequence();

        // 2. Resolve previous hash
        String previousHash = repository
                .findTopByOrderByAuditSequenceDesc()
                .map(AuditLog::getCurrentHash)
                .orElse(GENESIS_HASH);

        // 3. SAFE correlationId (CRITICAL FIX)
        String correlationId = Optional
                .ofNullable(MDC.get("correlationId"))
                .orElseGet(() -> {
                    String generated = UUID.randomUUID().toString();
                    MDC.put("correlationId", generated);
                    return generated;
                });

        // 4. Timestamp
        Instant now = Instant.now();

        // 5. Mask payloads
        String requestMasked = AuditMaskingUtil.mask(request);
        String responseMasked = AuditMaskingUtil.mask(response);

        // 6. Build canonical hash input
        String hashInput = buildHashInput(
                previousHash,
                sequence,
                correlationId,
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

        // 7. Compute hash
        String currentHash = AuditHashUtil.sha256(hashInput);

        // 8. Build audit log
        AuditLog auditLog = AuditLog.builder()
                .auditSequence(sequence)
                .correlationId(correlationId)
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

        // 9. HARD LOG — must appear in console
        log.info("AUDIT INSERT → action={}, resource={}, seq={}",
                action, resourceId, sequence);

        // 10. Persist
        repository.save(auditLog);
    }

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
                correlationId,
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
