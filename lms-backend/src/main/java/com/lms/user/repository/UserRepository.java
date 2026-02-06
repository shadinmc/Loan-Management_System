package com.lms.user.repository;

import com.lms.user.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByAadharNumber(String aadharNumber);
    Optional<User> findByPanNumber(String panNumber);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByAadharNumber(String aadharNumber);
    boolean existsByPanNumber(String panNumber);
}
