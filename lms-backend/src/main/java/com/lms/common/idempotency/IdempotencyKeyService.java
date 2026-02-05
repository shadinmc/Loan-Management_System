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
