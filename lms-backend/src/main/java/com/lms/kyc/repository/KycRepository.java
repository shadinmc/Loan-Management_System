package com.lms.kyc.repository;

import com.lms.kyc.entity.Kyc;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KycRepository extends MongoRepository<Kyc, String> {

    Optional<Kyc> findByUserId(String userId);
    List<Kyc> findByStatus(String status);

    boolean existsByAadhaarNumber(String aadhaarNumber);
    boolean existsByPanNumber(String panNumber);
    boolean existsByUserId(String userId);

}
