package com.lms.loan.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.common.exception.IdempotencyConflictException;
import com.lms.common.idempotency.IdempotencyKeyService;
import com.lms.common.idempotency.IdempotencyRecord;
import com.lms.common.enums.LoanType;
import com.lms.kyc.service.KycService;
import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.dto.PersonalLoanDetailsDto;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanServiceIdempotencyTest {

    @Mock
    private LoanRepository loanRepository;
    @Mock
    private IdempotencyKeyService idempotencyKeyService;
    @Mock
    private KycService kycService;
    @Mock
    private AuditService auditService;
    @Mock
    private SecurityUtils securityUtils;

    private LoanService loanService;

    @BeforeEach
    void setUp() {
        loanService = new LoanService(
                loanRepository,
                idempotencyKeyService,
                kycService,
                auditService,
                securityUtils
        );
    }

    @Test
    void applyForLoan_sameKeySamePayload_isIdempotent() {
        String userId = "user-1";
        String key = "idem-123";
        LoanApplicationRequest request = buildPersonalRequest(50000);

        when(securityUtils.getCurrentUserId()).thenReturn(userId);
        doNothing().when(kycService).validateKycVerified(userId);
        when(kycService.getCibilScore(userId)).thenReturn(750);
        when(loanRepository.save(any(Loan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        IdempotencyRecord record = new IdempotencyRecord();
        record.setIdempotencyKey(key);
        record.setResourceId("LN-EXISTING");
        record.setExpiresAt(Instant.now().plusSeconds(60));

        AtomicInteger calls = new AtomicInteger();
        when(idempotencyKeyService.findByKey(key)).thenAnswer(invocation -> {
            if (calls.getAndIncrement() == 0) {
                return Optional.empty();
            }
            return Optional.of(record);
        });

        Loan first = loanService.applyForLoan(request, key);
        record.setResourceId(first.getLoanId());
        when(loanRepository.findByLoanId(first.getLoanId())).thenReturn(Optional.of(first));

        Loan second = loanService.applyForLoan(request, key);

        verify(loanRepository, times(1)).save(any(Loan.class));
        verify(auditService, times(1)).log(
                eq(userId),
                eq("LOAN_APPLICATION"),
                eq("LOAN"),
                eq(first.getLoanId()),
                eq(request),
                eq(first),
                eq(201),
                eq(true)
        );
        verify(idempotencyKeyService, times(1))
                .saveKey(eq(key), eq(first.getLoanId()), eq("LOAN_APPLICATION"));

        // Same loanId should be returned on replay
        org.assertj.core.api.Assertions.assertThat(second.getLoanId()).isEqualTo(first.getLoanId());
    }

    @Test
    void applyForLoan_sameKeyDifferentPayload_throwsConflict() {
        String userId = "user-1";
        String key = "idem-456";
        LoanApplicationRequest request1 = buildPersonalRequest(50000);
        LoanApplicationRequest request2 = buildPersonalRequest(65000);

        when(securityUtils.getCurrentUserId()).thenReturn(userId);
        doNothing().when(kycService).validateKycVerified(userId);
        when(kycService.getCibilScore(userId)).thenReturn(750);

        IdempotencyRecord record = new IdempotencyRecord();
        record.setIdempotencyKey(key);
        record.setResourceId("LN-EXISTING");
        record.setExpiresAt(Instant.now().plusSeconds(60));

        when(idempotencyKeyService.findByKey(key)).thenReturn(Optional.of(record));

        assertThatThrownBy(() -> loanService.applyForLoan(request2, key))
                .isInstanceOf(IdempotencyConflictException.class);
    }

    @Test
    void applyForLoan_withoutIdempotencyKey_createsMultipleLoans() {
        String userId = "user-1";
        LoanApplicationRequest request = buildPersonalRequest(50000);

        when(securityUtils.getCurrentUserId()).thenReturn(userId);
        doNothing().when(kycService).validateKycVerified(userId);
        when(kycService.getCibilScore(userId)).thenReturn(750);
        when(loanRepository.save(any(Loan.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(idempotencyKeyService.findByKey(null)).thenReturn(Optional.empty());

        loanService.applyForLoan(request, null);
        loanService.applyForLoan(request, null);

        verify(loanRepository, times(2)).save(any(Loan.class));
        verify(auditService, times(2)).log(
                eq(userId),
                eq("LOAN_APPLICATION"),
                eq("LOAN"),
                any(),
                eq(request),
                any(),
                eq(201),
                eq(true)
        );
        verify(idempotencyKeyService, never()).saveKey(any(), any(), any());
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
