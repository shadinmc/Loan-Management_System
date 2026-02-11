package com.lms.disbursement.scheduler;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisbursementScheduler {

    private final LoanRepository loanRepository;

    // runs every 1 minute
    @Scheduled(fixedRate = 60000)
    public void processDisbursements() {

        List<Loan> loans =
                loanRepository.findByStatus(LoanStatus.DISBURSEMENT_PENDING);

        for (Loan loan : loans) {

            if (loan.getDisbursementScheduledAt() == null) continue;

            if (LocalDateTime.now()
                    .isAfter(loan.getDisbursementScheduledAt())) {

                loan.setStatus(LoanStatus.DISBURSED);
                loan.setDisbursedAt(LocalDateTime.now());

                loan.setTransactionId(
                        "TXN-" + System.currentTimeMillis()
                );

                loan.setUpdatedAt(LocalDateTime.now());
                loanRepository.save(loan);
            }
        }
    }
}
