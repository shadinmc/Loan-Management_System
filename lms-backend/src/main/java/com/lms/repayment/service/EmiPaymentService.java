package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.cibil.enums.CibilEventType;
import com.lms.cibil.service.CibilScoreService;
import com.lms.repayment.entity.Emi;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class EmiPaymentService {

    private final RepaymentScheduleRepository repaymentRepo;
    private final WalletService walletService;
    private final SecurityUtils securityUtils;
    private final CibilScoreService cibilScoreService;

    @Transactional
    public void payEmi(String loanId, BigDecimal amount) {

        String userId = securityUtils.getCurrentUserId();

        RepaymentSchedule schedule =
                repaymentRepo.findByLoanId(loanId)
                        .orElseThrow(() ->
                                new RuntimeException("Repayment schedule not found"));

        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if (schedule.isClosed()) {
            throw new RuntimeException("Loan already closed");
        }

        // 1️⃣ Find next pending EMI
        Emi nextEmi = schedule.getEmis().stream()
                .filter(e -> e.getStatus() == RepaymentStatus.PENDING)
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("No pending EMI"));

        if (amount.compareTo(nextEmi.getEmiAmount()) < 0) {
            throw new RuntimeException(
                    "Amount must be at least EMI amount");
        }

        // 2️⃣ Debit wallet
        walletService.withdraw(loanId, nextEmi.getEmiAmount());

        // 3️⃣ Mark EMI as PAID
        nextEmi.setPaidAmount(nextEmi.getEmiAmount());
        nextEmi.setStatus(RepaymentStatus.PAID);
        nextEmi.setPaidAt(Instant.now());

        cibilScoreService.applyEvent(
                userId,
                CibilEventType.EMI_PAID_ON_TIME
        );


        // 4️⃣ Update schedule summary
        schedule.setTotalPaidAmount(
                schedule.getTotalPaidAmount()
                        .add(nextEmi.getEmiAmount())
        );

        schedule.setOutstandingAmount(
                schedule.getOutstandingAmount()
                        .subtract(nextEmi.getEmiAmount())
        );

        // 5️⃣ Update next EMI info
        schedule.getEmis().stream()
                .filter(e -> e.getStatus() == RepaymentStatus.PENDING)
                .findFirst()
                .ifPresentOrElse(
                        emi -> {
                            schedule.setNextEmiDate(emi.getDueDate());
                            schedule.setNextEmiAmount(emi.getEmiAmount());
                        },
                        () -> {

                            // No pending EMIs → loan fully repaid
                            schedule.setClosed(true);
                            schedule.setNextEmiDate(null);
                            schedule.setNextEmiAmount(BigDecimal.ZERO);

                            //  ADD THIS LINE HERE
                            cibilScoreService.applyEvent(
                                    userId,
                                    CibilEventType.LOAN_CLOSED
                            );
                        }
                );

        schedule.setUpdatedAt(Instant.now());
        repaymentRepo.save(schedule);
    }
}

