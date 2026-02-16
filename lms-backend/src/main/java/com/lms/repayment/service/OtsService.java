package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.cibil.enums.CibilEventType;
import com.lms.cibil.service.CibilScoreService;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.dto.OtsQuoteResponse;
import com.lms.repayment.entity.Emi;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.policy.OtsPolicy;
import com.lms.repayment.policy.OtsPolicyResolver;
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
public class OtsService {

    private final RepaymentScheduleRepository repaymentRepo;
    private final LoanRepository loanRepository;
    private final WalletService walletService;
    private final SecurityUtils securityUtils;
    private final CibilScoreService cibilScoreService;
    private final OtsPolicyResolver otsPolicyResolver;


    private static final BigDecimal OTS_PRINCIPAL_FACTOR = new BigDecimal("0.60");
    private static final BigDecimal PENALTY_WAIVER_FACTOR = new BigDecimal("0.50");
    private static final BigDecimal OTS_SERVICE_CHARGE_RATE = new BigDecimal("0.01");

    public OtsQuoteResponse getQuote(String loanId) {

        String userId = securityUtils.getCurrentUserId();

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (!loan.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new RuntimeException("OTS allowed only for ACTIVE loans");
        }

        RepaymentSchedule schedule = repaymentRepo.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        /* 🔑 Remaining principal (single source of truth) */
        BigDecimal remainingPrincipal = resolveRemainingPrincipal(loan, schedule);

        /* 🔑 Resolve policy (internal only, frontend unaware) */
        OtsPolicy policy = otsPolicyResolver.resolve(loan);

        /* 1️⃣ Principal settlement */
        BigDecimal otsPrincipal = remainingPrincipal
                .multiply(policy.principalFactor())
                .setScale(2, RoundingMode.HALF_UP);

        /* 2️⃣ Remaining months */
        long remainingMonths = schedule.getEmis().stream()
                .filter(e -> e.getStatus() != RepaymentStatus.PAID)
                .count();

        /* 3️⃣ Flat remaining interest */
        BigDecimal monthlyInterest = schedule.getEmis().stream()
                .filter(e -> e.getStatus() != RepaymentStatus.PAID)
                .findFirst()
                .map(Emi::getInterestAmount)
                .orElse(BigDecimal.ZERO);

        BigDecimal remainingInterest = monthlyInterest
                .multiply(BigDecimal.valueOf(remainingMonths));

        BigDecimal reducedInterest = remainingInterest
                .multiply(policy.interestFactor())
                .setScale(2, RoundingMode.HALF_UP);

        /* 4️⃣ Penalty (same as before) */
        BigDecimal totalPenalty = schedule.getEmis().stream()
                .map(e -> e.getPenaltyAmount() == null ? BigDecimal.ZERO : e.getPenaltyAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal penaltyWaiver = totalPenalty
                .multiply(PENALTY_WAIVER_FACTOR)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal netPenalty = totalPenalty.subtract(penaltyWaiver).max(BigDecimal.ZERO);

        /* 5️⃣ Settlement amount */
        BigDecimal settlementAmount = otsPrincipal
                .add(reducedInterest)
                .add(netPenalty)
                .setScale(2, RoundingMode.HALF_UP);

        /* 6️⃣ Minimum recovery safeguard */
        BigDecimal minimumSettlement = remainingPrincipal
                .multiply(policy.minRecoveryFactor())
                .setScale(2, RoundingMode.HALF_UP);

        if (settlementAmount.compareTo(minimumSettlement) < 0) {
            settlementAmount = minimumSettlement;
        }

        /* 7️⃣ Reduced value (KEEP SAME RESPONSE FIELD) */
        BigDecimal reducedValue = remainingPrincipal
                .subtract(otsPrincipal)
                .max(BigDecimal.ZERO);

        return new OtsQuoteResponse(
                remainingPrincipal,     // SAME
                reducedValue,           // SAME meaning
                totalPenalty,           // SAME
                penaltyWaiver,          // SAME
                settlementAmount,       // SAME
                (int) remainingMonths   // SAME
        );
    }


    private BigDecimal resolveRemainingPrincipal(Loan loan, RepaymentSchedule schedule) {
        List<Emi> emis = schedule.getEmis() == null ? List.of() : schedule.getEmis();
        BigDecimal fromEmiPrincipal = emis.stream()
                .filter(e -> e.getStatus() != RepaymentStatus.PAID)
                .map(e -> e.getPrincipalAmount() == null ? BigDecimal.ZERO : e.getPrincipalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (fromEmiPrincipal.compareTo(BigDecimal.ZERO) > 0) {
            return fromEmiPrincipal;
        }

        BigDecimal basePrincipal = loan.getApprovedAmount() != null
                ? loan.getApprovedAmount()
                : loan.getLoanAmount();

        if (basePrincipal != null
                && basePrincipal.compareTo(BigDecimal.ZERO) > 0
                && !emis.isEmpty()) {
            long unpaidCount = emis.stream()
                    .filter(e -> e.getStatus() != RepaymentStatus.PAID)
                    .count();
            BigDecimal estimatedFromTenure = basePrincipal
                    .multiply(BigDecimal.valueOf(unpaidCount))
                    .divide(BigDecimal.valueOf(emis.size()), 2, RoundingMode.HALF_UP)
                    .max(BigDecimal.ZERO);

            if (schedule.getOutstandingPrincipal() != null
                    && schedule.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
                return schedule.getOutstandingPrincipal().min(estimatedFromTenure);
            }

            if (loan.getOutstandingPrincipal() != null
                    && loan.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
                return loan.getOutstandingPrincipal().min(estimatedFromTenure);
            }

            return estimatedFromTenure;
        }

        if (schedule.getOutstandingPrincipal() != null
                && schedule.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
            return schedule.getOutstandingPrincipal();
        }

        if (loan.getOutstandingPrincipal() != null
                && loan.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) > 0) {
            return loan.getOutstandingPrincipal();
        }

        return BigDecimal.ZERO;
    }

    @Transactional
    public void settle(String loanId, BigDecimal amount) {

        String userId = securityUtils.getCurrentUserId();
        OtsQuoteResponse quote = getQuote(loanId);

        if (amount.compareTo(quote.getSettlementAmount()) != 0) {
            throw new RuntimeException("Settlement amount mismatch");
        }

        String settlementReference = "OTS:" + loanId;
        walletService.withdraw(loanId, amount, settlementReference);

        RepaymentSchedule schedule = repaymentRepo.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        schedule.setClosed(true);
        schedule.setOutstandingAmount(BigDecimal.ZERO);
        schedule.setOutstandingPrincipal(BigDecimal.ZERO);
        schedule.setNextEmiAmount(BigDecimal.ZERO);
        schedule.setNextEmiDate(null);

        schedule.getEmis().forEach(emi -> {
            if (emi.getStatus() != RepaymentStatus.PAID) {
                emi.setStatus(RepaymentStatus.PAID);
                emi.setPaidAmount(emi.getEmiAmount());
                emi.setPaidAt(Instant.now());
            }
        });

        repaymentRepo.save(schedule);

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus(LoanStatus.CLOSED);
        loan.setClosedAt(Instant.now());
        loan.setUpdatedAt(Instant.now());

        cibilScoreService.applyEvent(userId, CibilEventType.LOAN_CLOSED_OTS);
        loanRepository.save(loan);
    }
}
