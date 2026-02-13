package com.lms.disbursement.scheduler;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisbursementScheduler {

    private final LoanRepository loanRepository;
    private final WalletService walletService;

    @Value("${loan.activation.delay.minutes}")
    private long activationDelayMinutes;


    @Scheduled(fixedRate = 60000)
    public void processDisbursements() {

        List<Loan> loans =
                loanRepository.findByStatus(LoanStatus.DISBURSEMENT_PENDING);

        for (Loan loan : loans) {

            if (loan.getDisbursementScheduledAt() == null) continue;

            if (Instant.now().isAfter(loan.getDisbursementScheduledAt())) {

                // 💰 CREDIT WALLET FIRST
                walletService.creditForLoanSystem(
                        loan.getUserId(),
                        loan.getLoanId(),
                        loan.getApprovedAmount()
                );

                // ✅ UPDATE LOAN
                loan.setStatus(LoanStatus.DISBURSED);
                loan.setDisbursedAt(Instant.now());
                loan.setTransactionId("TXN-" + System.currentTimeMillis());
                loan.setUpdatedAt(Instant.now());
                loan.setActivationScheduledAt(
                        Instant.now().plus(activationDelayMinutes, ChronoUnit.MINUTES)
                );


                loanRepository.save(loan);
            }
        }
    }
}

