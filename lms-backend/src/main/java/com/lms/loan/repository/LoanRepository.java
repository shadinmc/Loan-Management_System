package com.lms.loan.repository;

import com.lms.loan.entity.Loan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface LoanRepository extends MongoRepository<Loan, String> {
    Optional<Loan> findByLoanId(String loanId);
}
