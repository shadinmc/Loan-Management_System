package com.lms.disbursement.service;

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
public class DisbursementService {

    private final LoanRepository loanRepository;

    @Scheduled(fixedRate = 60000)
    public void processDisbursements() {

        List<Loan> loans =
                loanRepository.findByStatusAndDisbursementScheduledAtBefore(
                        LoanStatus.DISBURSEMENT_PENDING,
                        LocalDateTime.now()
                );

        for (Loan loan : loans) {

            loan.setStatus(LoanStatus.DISBURSED);
            loan.setDisbursedAt(LocalDateTime.now());

            // schedule activation after 1 hour
            loan.setActivationScheduledAt(LocalDateTime.now().plusHours(1));


            loan.setTransactionId(
                    "TXN-" + System.currentTimeMillis()
            );

            loan.setUpdatedAt(LocalDateTime.now());
            loanRepository.save(loan);
        }
    }

    @Scheduled(fixedRate = 60000)
    public void activateLoans() {

        List<Loan> loans =
                loanRepository.findByStatusAndActivationScheduledAtBefore(
                        LoanStatus.DISBURSED,
                        LocalDateTime.now()
                );

        for (Loan loan : loans) {

            loan.setStatus(LoanStatus.ACTIVE);
            loan.setUpdatedAt(LocalDateTime.now());

            loanRepository.save(loan);
        }
    }

}
