package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.audit.service.AuditService;
import com.lms.cibil.enums.CibilEventType;
import com.lms.cibil.service.CibilScoreService;
import com.lms.repayment.entity.Emi;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmiPaymentService {

    private final RepaymentScheduleRepository repaymentRepo;
    private final WalletService walletService;
    private final SecurityUtils securityUtils;
    private final CibilScoreService cibilScoreService;
    private final AuditService auditService;

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

        /* 1️⃣ Find next due EMI (PENDING or OVERDUE) */
        Emi nextEmi = schedule.getEmis().stream()
                .filter(e ->
                        e.getStatus() == RepaymentStatus.OVERDUE ||
                                e.getStatus() == RepaymentStatus.PENDING
                )
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No due EMI"));

        /* 2️⃣ Calculate payable amount */
        BigDecimal penalty =
                nextEmi.getPenaltyAmount() == null
                        ? BigDecimal.ZERO
                        : nextEmi.getPenaltyAmount();

        BigDecimal payableAmount =
                nextEmi.getEmiAmount().add(penalty);

        /* 3️⃣ STRICT amount validation */
        if (amount.compareTo(payableAmount) != 0) {
            throw new RuntimeException(
                    "You must pay exact amount: " + payableAmount);
        }

        /* 4️⃣ Debit wallet (exact amount only) */
        walletService.withdraw(loanId, payableAmount);

        /* 5️⃣ Mark EMI as PAID */
        nextEmi.setPaidAmount(payableAmount);
        nextEmi.setPenaltyAmount(BigDecimal.ZERO);
        nextEmi.setStatus(RepaymentStatus.PAID);
        nextEmi.setPaidAt(Instant.now());

        /* 6️⃣ Update schedule totals */
        schedule.setTotalPaidAmount(
                schedule.getTotalPaidAmount().add(payableAmount)
        );

        schedule.setOutstandingAmount(
                schedule.getOutstandingAmount().subtract(nextEmi.getEmiAmount())
        );

        /* 7️⃣ Move next EMI pointer */
        schedule.getEmis().stream()
                .filter(e ->
                        e.getStatus() == RepaymentStatus.PENDING ||
                                e.getStatus() == RepaymentStatus.OVERDUE
                )
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

        try {
            Map<String, Object> requestPayload = Map.of(
                    "loanId", loanId,
                    "amount", amount,
                    "payableAmount", payableAmount
            );

            Map<String, Object> responsePayload = new HashMap<>();
            responsePayload.put("nextEmiStatus", nextEmi.getStatus());
            responsePayload.put("scheduleClosed", schedule.isClosed());
            responsePayload.put("outstandingAmount", schedule.getOutstandingAmount());

            auditService.log(
                    userId,
                    "EMI_PAYMENT",
                    "LOAN",
                    loanId,
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

