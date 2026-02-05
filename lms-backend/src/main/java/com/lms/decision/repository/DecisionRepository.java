package com.lms.decision.repository;

import com.lms.decision.entity.DecisionEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DecisionRepository extends MongoRepository<DecisionEntity, String> {
    Optional<DecisionEntity> findByLoanId(String loanId);
}
