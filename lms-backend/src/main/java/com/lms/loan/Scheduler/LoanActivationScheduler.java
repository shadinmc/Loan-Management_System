package com.lms.loan.Scheduler;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.service.RepaymentScheduleGeneratorService;
import com.lms.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoanActivationScheduler {

    private final LoanRepository loanRepository;
    private final RepaymentScheduleGeneratorService generatorService;
    private final AuditService auditService;

    @Scheduled(fixedRate = 60000)
    public void activateLoans() {

        List<Loan> loans =
                loanRepository.findByStatus(LoanStatus.DISBURSED);

        for (Loan loan : loans) {

            if (loan.getActivationScheduledAt() == null) continue;

            if (Instant.now().isAfter(loan.getActivationScheduledAt())) {

                // ✅ Activate loan
                loan.setStatus(LoanStatus.ACTIVE);
                loan.setActivatedAt(Instant.now());
                loan.setUpdatedAt(Instant.now());

                // 🧱 BRICK 4 — Generate EMI schedule
                generatorService.generateForLoan(loan);

                loanRepository.save(loan);

                log.info(
                        "LOAN ACTIVATED + EMI SCHEDULE CREATED | loanId={}",
                        loan.getLoanId()
                );

                try {
                    Map<String, Object> requestPayload = Map.of(
                            "previousStatus", LoanStatus.DISBURSED,
                            "activationScheduledAt", loan.getActivationScheduledAt()
                    );

                    Map<String, Object> responsePayload = Map.of(
                            "currentStatus", loan.getStatus(),
                            "activatedAt", loan.getActivatedAt()
                    );

                    auditService.log(
                            "DISBURSEMENT_SCHEDULER",
                            "LOAN_ACTIVATION",
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

