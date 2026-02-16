package com.lms.jobs;

import ch.qos.logback.classic.spi.ILoggingEvent;
import com.lms.loan.Scheduler.LoanActivationScheduler;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.testutil.LogCaptureUtil;
import com.lms.testutil.TestCorrelationidUtil;
import com.lms.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class BackgroundJobLoggingTest {

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
    void activationJob_emitsSuccessLogWithTraceMetadata() {
        String loanId = "LN-7001";
        String userId = "user-7001";
        BigDecimal emiAmount = BigDecimal.valueOf(1100);
        int tenure = 3;

        Loan loan = TestDataFactory.disbursedLoanReadyForActivation(
                loanId,
                userId,
                emiAmount,
                tenure,
                Instant.now().minusSeconds(5)
        );
        loanRepository.save(loan);

        String jobId = "JOB-ACT-001";
        String correlationId = "corr-001";

        TestCorrelationidUtil.putJobContext(jobId, loanId, correlationId);
        try (LogCaptureUtil logs = LogCaptureUtil.captureFor(LoanActivationScheduler.class)) {
            loanActivationScheduler.activateLoans();

            ILoggingEvent event = logs.firstEventContaining("LOAN ACTIVATED + EMI SCHEDULE CREATED");
            assertThat(event).isNotNull();
            assertThat(event.getFormattedMessage()).contains("loanId=" + loanId);
            assertThat(event.getMDCPropertyMap().get("job_id")).isEqualTo(jobId);
            assertThat(event.getMDCPropertyMap().get("loan_id")).isEqualTo(loanId);
            assertThat(event.getMDCPropertyMap().get("correlationId")).isEqualTo(correlationId);
        } finally {
            TestCorrelationidUtil.clear();
        }
    }
}
