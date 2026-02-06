/*
package com.lms.common.idempotency;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IdempotencyKeyService {

    private final IdempotencyKeyRepository repository;

    public boolean exists(String key) {
        return repository.findByKey(key).isPresent();
    }

    // ✅ NOT STATIC
    public void register(
            String key,
            String path,
            String method,
            String referenceId
    ) {
        IdempotencyRecord entity = new IdempotencyRecord();
        entity.setKey(key);
        entity.setRequestPath(path);
        entity.setMethod(method);
        entity.setReferenceId(referenceId);
        entity.setCreatedAt(LocalDateTime.now());

        repository.save(entity);
    }
}
*/


package com.lms.common.idempotency;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class IdempotencyKeyService {

    private final IdempotencyKeyRepository idempotencyKeyRepository;

    public IdempotencyKeyService(IdempotencyKeyRepository idempotencyKeyRepository) {
        this.idempotencyKeyRepository = idempotencyKeyRepository;
    }

    public Optional<IdempotencyRecord> findByKey(String key) {
        return idempotencyKeyRepository.findByIdempotencyKey(key);
    }

    public IdempotencyRecord saveKey(String key, String resourceId, String resourceType) {
        IdempotencyRecord record = new IdempotencyRecord();
        record.setIdempotencyKey(key);
        record.setResourceId(resourceId);
        record.setResourceType(resourceType);
        record.setCreatedAt(LocalDateTime.now());
        record.setExpiresAt(LocalDateTime.now().plusHours(24)); // 24-hour expiry
        return idempotencyKeyRepository.save(record);
    }



    public boolean existsByKey(String key) {
        return idempotencyKeyRepository.existsByIdempotencyKey(key);
    }
}
