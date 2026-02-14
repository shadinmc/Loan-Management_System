/*
package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.repayment.entity.Emi;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrepaymentService {

    private final RepaymentScheduleRepository repaymentRepo;
    private final WalletService walletService;
    private final SecurityUtils securityUtils;

    @Transactional
    public void prepay(String loanId, BigDecimal amount) {

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

        // Find next pending EMI
        Emi nextEmi = schedule.getEmis().stream()
                .filter(e -> e.getStatus() == RepaymentStatus.PENDING)
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("No pending EMI"));

        if (amount.compareTo(nextEmi.getEmiAmount()) <= 0) {
            throw new RuntimeException(
                    "Prepayment amount must be greater than EMI amount");
        }

        // 1️⃣ Debit full amount
        walletService.withdraw(loanId, amount);

        // 2️⃣ Pay current EMI fully
        BigDecimal emiAmount = nextEmi.getEmiAmount();
        nextEmi.setPaidAmount(emiAmount);
        nextEmi.setStatus(RepaymentStatus.PAID);
        nextEmi.setPaidAt(Instant.now());

        // 3️⃣ Extra goes to principal
        BigDecimal extra =
                amount.subtract(emiAmount);

        // Update summary
        schedule.setTotalPaidAmount(
                schedule.getTotalPaidAmount().add(amount)
        );

        schedule.setOutstandingAmount(
                schedule.getOutstandingAmount().subtract(amount)
        );

        // 4️⃣ Reduce future EMIs count (TENURE REDUCTION)
        BigDecimal emiValue = emiAmount;

        int removableEmis =
                extra.divide(emiValue, RoundingMode.DOWN).intValue();

        List<Emi> futureEmis = schedule.getEmis().stream()
                .filter(e -> e.getStatus() == RepaymentStatus.PENDING)
                .toList();

        for (int i = futureEmis.size() - 1;
             i >= 0 && removableEmis > 0;
             i--) {

            schedule.getEmis().remove(futureEmis.get(i));
            removableEmis--;
        }

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
                            schedule.setClosed(true);
                            schedule.setNextEmiDate(null);
                            schedule.setNextEmiAmount(BigDecimal.ZERO);
                        }
                );

        schedule.setUpdatedAt(Instant.now());
        repaymentRepo.save(schedule);
    }
}

*/
