package com.lms.common.idempotency;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class IdempotencyKeyService {

    private final IdempotencyKeyRepository repository;

    public IdempotencyKeyService(IdempotencyKeyRepository repository) {
        this.repository = repository;
    }

    public Optional<IdempotencyRecord> findByKey(String key) {
        return repository.findByIdempotencyKey(key);
    }

    public IdempotencyRecord saveKey(
            String key,
            String resourceId,
            String resourceType
    ) {
        IdempotencyRecord record = new IdempotencyRecord();
        record.setIdempotencyKey(key);
        record.setResourceId(resourceId);
        record.setResourceType(resourceType);
        record.setCreatedAt(LocalDateTime.now());

        // ✅ 10-minute expiry
        record.setExpiresAt(LocalDateTime.now().plusMinutes(10));

        return repository.save(record);
    }
}
