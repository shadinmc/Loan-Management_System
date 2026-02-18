package com.lms.disbursement.scheduler;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.wallet.dto.WalletResponse;
import com.lms.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import com.lms.audit.service.AuditService;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisbursementScheduler {

    private final LoanRepository loanRepository;
    private final WalletService walletService;
    private final AuditService auditService;

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
                WalletResponse walletResponse = walletService.creditForLoanSystem(
                        loan.getUserId(),
                        loan.getLoanId(),
                        loan.getApprovedAmount()
                );

                // ✅ UPDATE LOAN
                loan.setStatus(LoanStatus.DISBURSED);
                loan.setDisbursedAt(Instant.now());
                loan.setTransactionId(walletResponse.getTransactionId());
                loan.setUpdatedAt(Instant.now());
                loan.setActivationScheduledAt(
                        Instant.now().plus(activationDelayMinutes, ChronoUnit.MINUTES)
                );


                loanRepository.save(loan);

                try {
                    Map<String, Object> requestPayload = Map.of(
                            "previousStatus", LoanStatus.DISBURSEMENT_PENDING,
                            "approvedAmount", loan.getApprovedAmount(),
                            "disbursementScheduledAt", loan.getDisbursementScheduledAt()
                    );

                    Map<String, Object> responsePayload = Map.of(
                            "currentStatus", loan.getStatus(),
                            "transactionId", loan.getTransactionId(),
                            "disbursedAt", loan.getDisbursedAt()
                    );

                    auditService.log(
                            "DISBURSEMENT_SCHEDULER",
                            "LOAN_DISBURSEMENT",
                            "LOAN",
                            loan.getLoanId(),
                            requestPayload,
                            responsePayload,
                            200,
                            true
                    );
                } catch (Exception e) {
                    log.error("AUDIT FAILED — request still successful", e);
                }
            }
        }
    }
}

