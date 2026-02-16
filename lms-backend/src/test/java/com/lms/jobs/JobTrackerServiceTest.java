package com.lms.jobs;

import com.lms.loan.Scheduler.LoanActivationScheduler;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.testutil.LogCaptureUtil;
import com.lms.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class JobTrackerServiceTest {

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
    void activationJob_retryDoesNotDuplicateScheduleOrLogs() {
        String loanId = "LN-9001";
        String userId = "user-9001";
        BigDecimal emiAmount = BigDecimal.valueOf(800);
        int tenure = 2;

        Loan loan = TestDataFactory.disbursedLoanReadyForActivation(
                loanId,
                userId,
                emiAmount,
                tenure,
                Instant.now().minusSeconds(5)
        );
        loanRepository.save(loan);

        try (LogCaptureUtil logs = LogCaptureUtil.captureFor(LoanActivationScheduler.class)) {
            loanActivationScheduler.activateLoans();
            loanActivationScheduler.activateLoans();

            assertThat(repaymentScheduleRepository.count()).isEqualTo(1);
            assertThat(logs.countContaining("LOAN ACTIVATED + EMI SCHEDULE CREATED | loanId=" + loanId))
                    .isEqualTo(1);
        }
    }
}