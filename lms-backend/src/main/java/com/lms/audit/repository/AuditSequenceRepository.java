package com.lms.audit.repository;

import com.lms.audit.entity.AuditSequence;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuditSequenceRepository
        extends MongoRepository<AuditSequence, String> {
}
