package com.lms.repayment;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.Scheduler.LoanActivationScheduler;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class RepaymentScheduleWorkerTest {

    @Autowired
    private LoanActivationScheduler loanActivationScheduler;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private RepaymentScheduleRepository repaymentScheduleRepository;

    @BeforeEach
    void setUp() {
        loanRepository.deleteAll();
        repaymentScheduleRepository.deleteAll();
    }

    @Test
    void activationJob_createsScheduleAndUpdatesLoan() {
        String loanId = "LN-6001";
        String userId = "user-6001";
        BigDecimal emiAmount = BigDecimal.valueOf(900);
        int tenure = 4;

        Loan loan = TestDataFactory.disbursedLoanReadyForActivation(
                loanId,
                userId,
                emiAmount,
                tenure,
                Instant.now().minusSeconds(5)
        );
        loanRepository.save(loan);

        loanActivationScheduler.activateLoans();

        Loan updated = loanRepository.findByLoanId(loanId).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo(LoanStatus.ACTIVE);
        assertThat(updated.getActivatedAt()).isNotNull();

        RepaymentSchedule schedule = repaymentScheduleRepository.findByLoanId(loanId).orElseThrow();
        assertThat(schedule.getEmis()).hasSize(tenure);
    }
}