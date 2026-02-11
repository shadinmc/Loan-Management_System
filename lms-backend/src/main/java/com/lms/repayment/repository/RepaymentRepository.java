package com.lms.repayment.repository;

import com.lms.repayment.entity.Repayment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RepaymentRepository extends MongoRepository<Repayment, String> {

    List<Repayment> findByLoanIdOrderByEmiNumberAsc(String loanId);

    long countByLoanId(String loanId);
}
