package com.lms.repayment.repository;

import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RepaymentScheduleRepository
        extends MongoRepository<RepaymentSchedule, String> {

    boolean existsByLoanId(String loanId);

    Optional<RepaymentSchedule> findByLoanId(String loanId);
}

