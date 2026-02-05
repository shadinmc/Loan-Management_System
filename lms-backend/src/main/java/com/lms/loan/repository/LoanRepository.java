package com.lms.loan.repository;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends MongoRepository<Loan, String> {
    List<Loan> findAll();

    Optional<Loan>  findByLoanId(String loanId);

//    <T> ScopedValue<T> findByLoanId(String loanId);
}
