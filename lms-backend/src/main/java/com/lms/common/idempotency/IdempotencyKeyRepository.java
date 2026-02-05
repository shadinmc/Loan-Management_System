package com.lms.common.idempotency;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface IdempotencyKeyRepository
        extends MongoRepository<IdempotencyRecord, String> {

    Optional<IdempotencyRecord> findByKey(String key);
}
