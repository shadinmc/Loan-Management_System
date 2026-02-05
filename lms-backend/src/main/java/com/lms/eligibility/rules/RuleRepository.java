package com.lms.eligibility.rules;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RuleRepository extends MongoRepository<RuleEntity, String> {
    List<RuleEntity> findByActiveTrue();
}
