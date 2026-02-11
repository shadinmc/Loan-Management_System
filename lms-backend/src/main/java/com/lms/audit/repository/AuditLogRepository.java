package com.lms.audit.repository;

import com.lms.audit.entity.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    Optional<AuditLog> findTopByOrderByAuditSequenceDesc();
}
