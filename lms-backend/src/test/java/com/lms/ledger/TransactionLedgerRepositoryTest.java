package com.lms.ledger;

import com.lms.disbursement.scheduler.DisbursementScheduler;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.testutil.TestDataFactory;
import com.lms.wallet.entity.WalletTransaction;
import com.lms.wallet.enums.PaymentAction;
import com.lms.wallet.repository.WalletTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class TransactionLedgerRepositoryTest {

    @Autowired
    private DisbursementScheduler disbursementScheduler;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @BeforeEach
    void setUp() {
        loanRepository.deleteAll();
        walletTransactionRepository.deleteAll();
    }

    @Test
    void disbursement_createsLedgerEntry() {
        String loanId = "LN-4001";
        String userId = "user-4001";
        BigDecimal amount = BigDecimal.valueOf(7500);

        Loan loan = TestDataFactory.disbursementPendingLoan(
                loanId,
                userId,
                amount,
                Instant.now().minusSeconds(10)
        );
        loanRepository.save(loan);

        disbursementScheduler.processDisbursements();

        assertThat(walletTransactionRepository.count()).isEqualTo(1);
        WalletTransaction tx = walletTransactionRepository.findAll().get(0);
        assertThat(tx.getLoanId()).isEqualTo(loanId);
        assertThat(tx.getUserId()).isEqualTo(userId);
        assertThat(tx.getAmount()).isEqualByComparingTo(amount);
        assertThat(tx.getAction()).isEqualTo(PaymentAction.CREDIT);
    }
}