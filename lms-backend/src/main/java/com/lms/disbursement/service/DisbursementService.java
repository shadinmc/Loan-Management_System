/*
package com.lms.disbursement.service;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisbursementService {


    private final LoanRepository loanRepository;
    private final WalletService walletService;


    @Transactional
    @Scheduled(fixedRate = 60000)
    public void processDisbursements() {

        log.error("🚀 ENTERED processDisbursements()");


        List<Loan> loans =
                loanRepository.findByStatusAndDisbursementScheduledAtBefore(
                        LoanStatus.DISBURSEMENT_PENDING,
                        Instant.now()
                );


        log.error("📦 LOANS FOUND = {}", loans.size());


        for (Loan loan : loans) {
            try {
                log.info("DISBURSEMENT START | loanId={} userId={} amount={}",
                        loan.getLoanId(),
                        loan.getUserId(),
                        loan.getApprovedAmount());

                walletService.creditForLoanSystem(
                        loan.getUserId(),
                        loan.getLoanId(),
                        loan.getApprovedAmount()
                );

                log.error("💰 WALLET CREDIT SUCCESS loanId={}", loan.getLoanId());


                loan.setStatus(LoanStatus.DISBURSED);
                loan.setDisbursedAt(LocalDateTime.now());
                loan.setActivationScheduledAt(Instant.now().plusSeconds(1800));
                loan.setTransactionId("TXN-" + System.currentTimeMillis());
                loan.setUpdatedAt(LocalDateTime.now());

                loanRepository.save(loan);


            } catch (Exception e) {
                log.error("❌ WALLET CREDIT FAILED loanId={}", loan.getLoanId(), e);
            }
        }


    }

    @Scheduled(fixedRate = 60000)
    public void activateLoans() {

        List<Loan> loans =
                loanRepository.findByStatusAndActivationScheduledAtBefore(
                        LoanStatus.DISBURSED,
                        Instant.now()
                );

        for (Loan loan : loans) {

            loan.setStatus(LoanStatus.ACTIVE);
            loan.setUpdatedAt(LocalDateTime.now());

            loanRepository.save(loan);
        }
    }

}
*/
