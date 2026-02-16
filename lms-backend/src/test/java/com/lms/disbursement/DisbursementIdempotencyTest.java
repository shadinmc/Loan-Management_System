package com.lms.disbursement;

import com.lms.disbursement.scheduler.DisbursementScheduler;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.testutil.LogCaptureUtil;
import com.lms.testutil.TestDataFactory;
import com.lms.wallet.entity.Wallet;
import com.lms.wallet.repository.WalletRepository;
import com.lms.wallet.repository.WalletTransactionRepository;
import com.lms.wallet.service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class DisbursementIdempotencyTest {

    @Autowired
    private DisbursementScheduler disbursementScheduler;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private WalletRepository walletRepository;
    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @BeforeEach
    void setUp() {
        loanRepository.deleteAll();
        walletRepository.deleteAll();
        walletTransactionRepository.deleteAll();
    }

    @Test
    void processDisbursements_retryDoesNotDuplicateLedgerOrLogs() {
        String loanId = "LN-2001";
        String userId = "user-2001";
        BigDecimal amount = BigDecimal.valueOf(5000);

        Loan loan = TestDataFactory.disbursementPendingLoan(
                loanId,
                userId,
                amount,
                Instant.now().minusSeconds(5)
        );
        loanRepository.save(loan);

        try (LogCaptureUtil logs = LogCaptureUtil.captureFor(WalletService.class)) {
            disbursementScheduler.processDisbursements();
            disbursementScheduler.processDisbursements();

            assertThat(walletTransactionRepository.count()).isEqualTo(1);

            Wallet wallet = walletRepository.findByUserId(userId).orElseThrow();
            assertThat(wallet.getBalance()).isEqualByComparingTo(amount);

            assertThat(logs.countContaining("CREDIT WALLET | userId=" + userId + " loanId=" + loanId))
                    .isEqualTo(1);
        }
    }
}
