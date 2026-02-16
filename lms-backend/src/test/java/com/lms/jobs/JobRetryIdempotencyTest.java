package com.lms.jobs;

import com.lms.cibil.service.CibilScoreService;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.repayment.scheduler.EmiOverdueScheduler;
import com.lms.testutil.LogCaptureUtil;
import com.lms.testutil.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;

@SpringBootTest
public class JobRetryIdempotencyTest {

    @Autowired
    private EmiOverdueScheduler emiOverdueScheduler;
    @Autowired
    private RepaymentScheduleRepository repaymentScheduleRepository;

    @MockitoBean
    private CibilScoreService cibilScoreService;

    @BeforeEach
    void setUp() {
        repaymentScheduleRepository.deleteAll();
        doNothing().when(cibilScoreService).applyEvent(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void overduePenalty_retryDoesNotDuplicateLogOrPenalty() {
        String loanId = "LN-8001";
        String userId = "user-8001";
        BigDecimal emiAmount = BigDecimal.valueOf(1000);

        RepaymentSchedule schedule = TestDataFactory.overdueSchedule(
                loanId,
                userId,
                emiAmount,
                Instant.now().minus(2, ChronoUnit.DAYS),
                null
        );
        repaymentScheduleRepository.save(schedule);

        try (LogCaptureUtil logs = LogCaptureUtil.captureFor(EmiOverdueScheduler.class)) {
            emiOverdueScheduler.applyOverduePenalties();
            emiOverdueScheduler.applyOverduePenalties();

            RepaymentSchedule updated = repaymentScheduleRepository.findByLoanId(loanId).orElseThrow();
            BigDecimal expectedPenalty = emiAmount.multiply(new BigDecimal("0.02"));

            assertThat(updated.getEmis().get(0).getPenaltyAmount())
                    .isEqualByComparingTo(expectedPenalty);
            assertThat(logs.countContaining("PENALTY APPLIED | loanId=" + loanId)).isEqualTo(1);
        }
    }
}
