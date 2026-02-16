package com.lms.loan.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.common.enums.LoanStatus;
import com.lms.common.idempotency.IdempotencyKeyService;
import com.lms.common.idempotency.IdempotencyRecord;
import com.lms.kyc.service.KycService;
import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.dto.PersonalLoanDetailsDto;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.common.enums.LoanType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class LoanServiceIdempotencyTest {

    @Mock private LoanRepository loanRepository;
    @Mock private IdempotencyKeyService idempotencyService;
    @Mock private KycService kycService;
    @Mock private AuditService auditService;
    @Mock private SecurityUtils securityUtils;

    private LoanService loanService;

    @BeforeEach
    void setUp() {
        loanService = new LoanService(
                loanRepository,
                idempotencyService,
                kycService,
                auditService,
                securityUtils
        );
    }

    // ----------------------------------------------------
    // SAME KEY → RETURNS EXISTING LOAN (REPLAY)
    // ----------------------------------------------------
    @Test
    void applyForLoan_sameKey_replaysExistingLoan() {
        String userId = "user-1";
        String key = "idem-123";

        LoanApplicationRequest request = buildRequest();

        when(securityUtils.getCurrentUserId()).thenReturn(userId);
        doNothing().when(kycService).validateKycVerified(userId);

        when(loanRepository.existsByUserIdAndLoanTypeAndStatusIn(
                any(), any(), any()
        )).thenReturn(false);

        IdempotencyRecord record = new IdempotencyRecord();
        record.setIdempotencyKey(key);
        record.setResourceId("LN-1");
        record.setExpiresAt(Instant.now().plusSeconds(60));

        when(idempotencyService.findByKey(key))
                .thenReturn(Optional.of(record));

        Loan existingLoan = buildLoan("LN-1", userId);

        when(loanRepository.findByLoanId("LN-1"))
                .thenReturn(Optional.of(existingLoan));

        var response = loanService.applyForLoan(request, key);

        assertThat(response.getLoanId()).isEqualTo("LN-1");
        verify(loanRepository, never()).save(any());
    }

    // ----------------------------------------------------
    // NO IDEMPOTENCY KEY → CREATES MULTIPLE LOANS
    // ----------------------------------------------------
    @Test
    void applyForLoan_withoutIdempotencyKey_createsMultipleLoans() {
        String userId = "user-1";

        when(securityUtils.getCurrentUserId()).thenReturn(userId);
        doNothing().when(kycService).validateKycVerified(userId);

        when(loanRepository.existsByUserIdAndLoanTypeAndStatusIn(
                any(), any(), any()
        )).thenReturn(false);

        when(loanRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        loanService.applyForLoan(buildRequest(), null);
        loanService.applyForLoan(buildRequest(), null);

        verify(loanRepository, times(2)).save(any());
        verify(idempotencyService, times(2))
                .saveKey(isNull(), any(), eq("LOAN_APPLICATION"));
    }

    // ----------------------------------------------------
    // HELPERS
    // ----------------------------------------------------
    private Loan buildLoan(String loanId, String userId) {
        return Loan.builder()
                .loanId(loanId)
                .userId(userId)
                .loanType(LoanType.PERSONAL)
                .loanAmount(BigDecimal.valueOf(100000))
                .tenureMonths(12)
                .status(LoanStatus.APPLIED)
                .appliedDate(Instant.now())
                .emiEligible(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    private LoanApplicationRequest buildRequest() {
        LoanApplicationRequest request = new LoanApplicationRequest();
        request.setLoanType(LoanType.PERSONAL);
        request.setLoanAmount(100000.0);
        request.setTenureMonths(12);

        PersonalLoanDetailsDto details = new PersonalLoanDetailsDto();
        details.setEmploymentType("SALARIED");
        details.setMonthlyIncome(BigDecimal.valueOf(50000));
        details.setEmployerName("ACME");
        details.setProofOfIdentity("aGVsbG8=");
        details.setProofOfIncome("aGVsbG8=");
        details.setProofOfAddress("aGVsbG8=");

        request.setPersonalLoanDetails(details);
        return request;
    }
}
