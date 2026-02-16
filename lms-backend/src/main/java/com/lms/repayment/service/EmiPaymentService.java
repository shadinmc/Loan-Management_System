package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.cibil.service.CibilScoreService;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
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

@Service
@RequiredArgsConstructor
public class EmiPaymentService {

    private final RepaymentScheduleRepository repaymentRepo;
    private final WalletService walletService;
    private final SecurityUtils securityUtils;
    private final CibilScoreService cibilScoreService;
    private final LoanRepository loanRepository;

    @Transactional
    public void payEmi(String loanId, BigDecimal amount) {

        String userId = securityUtils.getCurrentUserId();

        RepaymentSchedule schedule = repaymentRepo.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Repayment schedule not found"));

        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if (schedule.isClosed()) {
            throw new RuntimeException("Loan already closed");
        }

        Emi nextEmi = schedule.getEmis().stream()
                .filter(e ->
                        e.getStatus() == RepaymentStatus.PENDING ||
                                e.getStatus() == RepaymentStatus.OVERDUE
                )
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No due EMI"));

        BigDecimal penalty = nextEmi.getPenaltyAmount() == null
                ? BigDecimal.ZERO
                : nextEmi.getPenaltyAmount();

        BigDecimal payableAmount = nextEmi.getEmiAmount().add(penalty);

        if (amount.compareTo(payableAmount) != 0) {
            throw new RuntimeException("Exact EMI amount required: " + payableAmount);
        }

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        BigDecimal principalComponent = resolvePrincipalComponent(nextEmi, schedule, loan);

        String repaymentReference = "EMI:" + loanId + ":" + nextEmi.getEmiNumber();
        walletService.withdraw(loanId, payableAmount, repaymentReference);

        /* Mark EMI PAID */
        nextEmi.setPaidAmount(payableAmount);
        nextEmi.setPenaltyAmount(BigDecimal.ZERO);
        nextEmi.setStatus(RepaymentStatus.PAID);
        nextEmi.setPaidAt(Instant.now());
        nextEmi.setPrincipalAmount(principalComponent);

        /* 🔑 ACCOUNTING FIX */
        BigDecimal currentOutstandingPrincipal =
                schedule.getOutstandingPrincipal() != null
                        ? schedule.getOutstandingPrincipal()
                        : schedule.getEmis().stream()
                        .filter(e -> e.getStatus() != RepaymentStatus.PAID)
                        .map(e -> e.getPrincipalAmount() == null ? BigDecimal.ZERO : e.getPrincipalAmount())
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        schedule.setOutstandingPrincipal(
                currentOutstandingPrincipal.subtract(
                        principalComponent
                ).max(BigDecimal.ZERO)
        );


        schedule.setOutstandingAmount(
                schedule.getOutstandingAmount()
                        .subtract(nextEmi.getEmiAmount())
        );

        schedule.setTotalPaidAmount(
                schedule.getTotalPaidAmount().add(payableAmount)
        );

        /* Move pointer */
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

        loan.setOutstandingPrincipal(schedule.getOutstandingPrincipal());
        loan.setUpdatedAt(Instant.now());
        loanRepository.save(loan);
    }

    private BigDecimal resolvePrincipalComponent(Emi emi, RepaymentSchedule schedule, Loan loan) {
        if (emi.getPrincipalAmount() != null && emi.getPrincipalAmount().compareTo(BigDecimal.ZERO) > 0) {
            return emi.getPrincipalAmount();
        }

        if (emi.getEmiAmount() != null && emi.getInterestAmount() != null) {
            BigDecimal fromBreakup = emi.getEmiAmount()
                    .subtract(emi.getInterestAmount())
                    .max(BigDecimal.ZERO)
                    .setScale(2, RoundingMode.HALF_UP);
            if (fromBreakup.compareTo(BigDecimal.ZERO) > 0) {
                return fromBreakup;
            }
        }

        long unpaidCount = schedule.getEmis().stream()
                .filter(e -> e.getStatus() == RepaymentStatus.PENDING || e.getStatus() == RepaymentStatus.OVERDUE)
                .count();

        if (unpaidCount > 0 && schedule.getOutstandingPrincipal() != null
                && schedule.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
            return schedule.getOutstandingPrincipal()
                    .divide(BigDecimal.valueOf(unpaidCount), 2, RoundingMode.HALF_UP)
                    .max(BigDecimal.ZERO);
        }

        if (unpaidCount > 0 && loan.getOutstandingPrincipal() != null
                && loan.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
            return loan.getOutstandingPrincipal()
                    .divide(BigDecimal.valueOf(unpaidCount), 2, RoundingMode.HALF_UP)
                    .max(BigDecimal.ZERO);
        }

        BigDecimal basePrincipal = loan.getApprovedAmount() != null
                ? loan.getApprovedAmount()
                : loan.getLoanAmount();

        int totalEmiCount = schedule.getEmis() == null ? 0 : schedule.getEmis().size();
        if (basePrincipal != null
                && basePrincipal.compareTo(BigDecimal.ZERO) > 0
                && totalEmiCount > 0) {
            BigDecimal estimatedPerEmiPrincipal = basePrincipal
                    .divide(BigDecimal.valueOf(totalEmiCount), 2, RoundingMode.HALF_UP)
                    .max(BigDecimal.ZERO);

            if (schedule.getOutstandingPrincipal() != null
                    && schedule.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
                return estimatedPerEmiPrincipal.min(schedule.getOutstandingPrincipal());
            }
            if (loan.getOutstandingPrincipal() != null
                    && loan.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
                return estimatedPerEmiPrincipal.min(loan.getOutstandingPrincipal());
            }
            return estimatedPerEmiPrincipal;
        }

        if (emi.getEmiAmount() != null && emi.getEmiAmount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal bestEffort = emi.getEmiAmount().setScale(2, RoundingMode.HALF_UP);
            if (schedule.getOutstandingPrincipal() != null
                    && schedule.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
                return bestEffort.min(schedule.getOutstandingPrincipal());
            }
            return bestEffort;
        }

        return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
    }
}
