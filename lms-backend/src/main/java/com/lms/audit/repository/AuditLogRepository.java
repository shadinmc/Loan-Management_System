package com.lms.audit.repository;

import com.lms.audit.entity.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    Optional<AuditLog> findTopByOrderByAuditSequenceDesc();
    List<AuditLog> findAllByOrderByCreatedAtDesc();
    Page<AuditLog> findAllBy(Pageable pageable);
}
