package com.lms.audit.service;

import com.lms.audit.entity.AuditLog;
import com.lms.audit.repository.AuditLogRepository;
import com.lms.audit.util.AuditMaskingUtil;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuditService {

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
            int status,
            boolean success
    ) {
        AuditLog log = AuditLog.builder()
                .auditSequence(sequenceService.nextSequence())
                .correlationId(MDC.get("correlationId"))
                .userId(userId)
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .requestPayloadMasked(AuditMaskingUtil.mask(request))
                .responsePayloadMasked(AuditMaskingUtil.mask(response))
                .httpStatus(status)
                .success(success)
                .createdAt(Instant.now())
                .build();

        repository.save(log);
    }
}
