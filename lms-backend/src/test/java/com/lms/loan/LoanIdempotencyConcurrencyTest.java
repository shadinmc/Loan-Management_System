package com.lms.loan;

import com.lms.audit.entity.AuditSequence;
import com.lms.audit.repository.AuditLogRepository;
import com.lms.auth.security.SecurityUtils;
import com.lms.common.enums.LoanType;
import com.lms.kyc.service.KycService;
import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.dto.PersonalLoanDetailsDto;
import com.lms.loan.repository.LoanRepository;
import com.lms.loan.service.LoanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.math.BigDecimal;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@SpringBootTest
class LoanIdempotencyConcurrencyTest {

    @Autowired
    private LoanService loanService;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private AuditLogRepository auditLogRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    @MockBean
    private SecurityUtils securityUtils;
    @MockBean
    private KycService kycService;

    @BeforeEach
    void setUp() {
        loanRepository.deleteAll();
        auditLogRepository.deleteAll();
        if (mongoTemplate.collectionExists(AuditSequence.class)) {
            mongoTemplate.dropCollection(AuditSequence.class);
        }

        when(securityUtils.getCurrentUserId()).thenReturn("user-1");
        doNothing().when(kycService).validateKycVerified("user-1");
        when(kycService.getCibilScore("user-1")).thenReturn(750);
    }

    @Test
    void concurrentCalls_sameKey_singleLoanPersisted() throws Exception {
        LoanApplicationRequest request = buildPersonalRequest(50000);
        String key = "same-key";

        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);

        Future<String> first = executor.submit(() -> {
            ready.countDown();
            start.await(5, TimeUnit.SECONDS);
            return loanService.applyForLoan(request, key).getLoanId();
        });

        Future<String> second = executor.submit(() -> {
            ready.countDown();
            start.await(5, TimeUnit.SECONDS);
            return loanService.applyForLoan(request, key).getLoanId();
        });

        ready.await(5, TimeUnit.SECONDS);
        start.countDown();

        String loanId1 = first.get(10, TimeUnit.SECONDS);
        String loanId2 = second.get(10, TimeUnit.SECONDS);

        executor.shutdownNow();

        assertThat(loanId2).isEqualTo(loanId1);
        assertThat(loanRepository.count()).isEqualTo(1);
        assertThat(auditLogRepository.count()).isEqualTo(1);
    }

    private LoanApplicationRequest buildPersonalRequest(double income) {
        LoanApplicationRequest request = new LoanApplicationRequest();
        request.setLoanType(LoanType.PERSONAL);
        request.setLoanAmount(100000.0);
        request.setTenureMonths(12);
        request.setInterestRate(12.5);
        request.setCibilScore(750);

        PersonalLoanDetailsDto details = new PersonalLoanDetailsDto();
        details.setEmploymentType("SALARIED");
        details.setMonthlyIncome(BigDecimal.valueOf(income));
        details.setEmployerName("ACME");
        details.setProofOfIdentity("aGVsbG8=");
        details.setProofOfIncome("aGVsbG8=");
        details.setProofOfAddress("aGVsbG8=");
        request.setPersonalLoanDetails(details);

        return request;
    }
}
