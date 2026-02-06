/*
package com.lms.common.idempotency;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface IdempotencyKeyRepository
        extends MongoRepository<IdempotencyRecord, String> {

    Optional<IdempotencyRecord> findByKey(String key);
}
*/

package com.lms.common.idempotency;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IdempotencyKeyRepository extends MongoRepository<IdempotencyRecord, String> {

    Optional<IdempotencyRecord> findByIdempotencyKey(String idempotencyKey);

    boolean existsByIdempotencyKey(String idempotencyKey);
}
