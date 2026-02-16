package com.lms.disbursement;

import com.lms.common.enums.LoanStatus;
import com.lms.disbursement.scheduler.DisbursementScheduler;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.testutil.LogCaptureUtil;
import com.lms.testutil.TestDataFactory;
import com.lms.wallet.entity.Wallet;
import com.lms.wallet.entity.WalletTransaction;
import com.lms.wallet.enums.PaymentAction;
import com.lms.wallet.repository.WalletRepository;
import com.lms.wallet.repository.WalletTransactionRepository;
import com.lms.wallet.service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest

public class DisbursementServiceTest {

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
    void processDisbursements_createsLedgerEntryAndLogs() {
        String loanId = "LN-1001";
        String userId = "user-1001";
        BigDecimal amount = BigDecimal.valueOf(10000);

        Loan loan = TestDataFactory.disbursementPendingLoan(
                loanId,
                userId,
                amount,
                Instant.now().minusSeconds(10)
        );
        loanRepository.save(loan);

        try (LogCaptureUtil logs = LogCaptureUtil.captureFor(WalletService.class)) {
            disbursementScheduler.processDisbursements();

            Loan updated = loanRepository.findByLoanId(loanId).orElseThrow();
            assertThat(updated.getStatus()).isEqualTo(LoanStatus.DISBURSED);
            assertThat(updated.getTransactionId()).isNotBlank();
            assertThat(updated.getActivationScheduledAt()).isNotNull();
            assertThat(updated.getDisbursedAt()).isNotNull();

            Wallet wallet = walletRepository.findByUserId(userId).orElseThrow();
            assertThat(wallet.getBalance()).isEqualByComparingTo(amount);

            List<WalletTransaction> txs = walletTransactionRepository.findAll();
            assertThat(txs).hasSize(1);

            WalletTransaction tx = txs.get(0);
            assertThat(tx.getLoanId()).isEqualTo(loanId);
            assertThat(tx.getUserId()).isEqualTo(userId);
            assertThat(tx.getAmount()).isEqualByComparingTo(amount);
            assertThat(tx.getAction()).isEqualTo(PaymentAction.CREDIT);

            assertThat(logs.contains("CREDIT WALLET | userId=" + userId + " loanId=" + loanId))
                    .isTrue();
        }
    }
}
