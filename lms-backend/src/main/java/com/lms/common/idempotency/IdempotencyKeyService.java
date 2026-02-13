package com.lms.common.idempotency;

import org.springframework.stereotype.Service;

import java.util.Optional;
import java.time.Duration;
import java.time.Instant;

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
        record.setCreatedAt(Instant.now());

        //  1-minute expiry
        record.setExpiresAt(Instant.now().plus(Duration.ofMinutes(1)));

        return repository.save(record);
    }
}