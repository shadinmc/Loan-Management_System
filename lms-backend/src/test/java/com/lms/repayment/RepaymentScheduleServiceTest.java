package com.lms.repayment;

import com.lms.loan.entity.Loan;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.repayment.service.RepaymentScheduleGeneratorService;
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
public class RepaymentScheduleServiceTest {

    @Autowired
    private RepaymentScheduleGeneratorService generatorService;
    @Autowired
    private RepaymentScheduleRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void generateForLoan_persistsScheduleAndLogs() {
        String loanId = "LN-5001";
        String userId = "user-5001";
        BigDecimal emiAmount = BigDecimal.valueOf(1000);
        int tenure = 3;

        Loan loan = TestDataFactory.activatedLoanForSchedule(
                loanId,
                userId,
                emiAmount,
                tenure,
                Instant.now()
        );

        try (LogCaptureUtil logs = LogCaptureUtil.captureFor(RepaymentScheduleGeneratorService.class)) {
            generatorService.generateForLoan(loan);

            RepaymentSchedule schedule = repository.findByLoanId(loanId).orElseThrow();
            assertThat(schedule.getEmis()).hasSize(tenure);
            assertThat(schedule.getTotalPayableAmount())
                    .isEqualByComparingTo(emiAmount.multiply(BigDecimal.valueOf(tenure)));
            assertThat(schedule.getOutstandingAmount())
                    .isEqualByComparingTo(emiAmount.multiply(BigDecimal.valueOf(tenure)));
            assertThat(schedule.getNextEmiDate()).isEqualTo(schedule.getEmis().get(0).getDueDate());
            assertThat(schedule.getNextEmiAmount()).isEqualByComparingTo(emiAmount);

            assertThat(logs.contains("EMI SCHEDULE GENERATED | loanId=" + loanId)).isTrue();
        }
    }

    @Test
    void generateForLoan_duplicateLoanId_isIdempotent() {
        String loanId = "LN-5002";
        String userId = "user-5002";
        BigDecimal emiAmount = BigDecimal.valueOf(1200);
        int tenure = 2;

        Loan loan = TestDataFactory.activatedLoanForSchedule(
                loanId,
                userId,
                emiAmount,
                tenure,
                Instant.now()
        );

        generatorService.generateForLoan(loan);

        try (LogCaptureUtil logs = LogCaptureUtil.captureFor(RepaymentScheduleGeneratorService.class)) {
            generatorService.generateForLoan(loan);

            assertThat(repository.count()).isEqualTo(1);
            assertThat(logs.contains("Repayment schedule already exists | loanId=" + loanId)).isTrue();
        }
    }
}