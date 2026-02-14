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
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.EnumSet;

@Service
@RequiredArgsConstructor
public class OtsService {

    private final RepaymentScheduleRepository repaymentRepo;
    private final LoanRepository loanRepository;
    private final WalletService walletService;
    private final SecurityUtils securityUtils;
    private final CibilScoreService cibilScoreService;

    /** Customer pays only 60% of remaining EMIs */
    private static final BigDecimal OTS_DISCOUNT_FACTOR = new BigDecimal("0.60");

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
                .orElseThrow(() -> new RuntimeException("Repayment schedule not found"));

        /* 1️⃣ Remaining EMIs */
        var remainingEmis = schedule.getEmis().stream()
                .filter(e ->
                        e.getStatus() == RepaymentStatus.PENDING ||
                                e.getStatus() == RepaymentStatus.OVERDUE
                )
                .toList();

        int remainingMonths = remainingEmis.size();

        /* 2️⃣ Remaining EMI total (TRUE outstanding) */
        BigDecimal remainingEmiTotal = remainingEmis.stream()
                .map(Emi::getEmiAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        /* 3️⃣ OTS discounted base (60% of remaining EMIs) */
        BigDecimal discountedOutstanding = remainingEmiTotal
                .multiply(OTS_DISCOUNT_FACTOR)
                .setScale(2, RoundingMode.HALF_UP);

        /* 4️⃣ Penalty calculation */
        BigDecimal totalPenalty = remainingEmis.stream()
                .map(Emi::getPenaltyAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal penaltyWaiver = totalPenalty
                .multiply(new BigDecimal("0.50"))
                .setScale(2, RoundingMode.HALF_UP);

        /* 5️⃣ Final settlement amount */
        BigDecimal settlementAmount = discountedOutstanding
                .add(totalPenalty.subtract(penaltyWaiver))
                .setScale(2, RoundingMode.HALF_UP);

        return new OtsQuoteResponse(
                remainingEmiTotal,                 // original outstanding
                remainingEmiTotal.subtract(discountedOutstanding), // discount given
                totalPenalty,
                penaltyWaiver,
                settlementAmount,
                remainingMonths
        );
    }

    @Transactional
    public void settle(String loanId, BigDecimal amount) {

        String userId = securityUtils.getCurrentUserId();

        OtsQuoteResponse quote = getQuote(loanId);

        if (amount.compareTo(quote.getSettlementAmount()) != 0) {
            throw new RuntimeException("Settlement amount mismatch");
        }

        /* 1️⃣ Debit wallet */
        walletService.withdraw(loanId, amount);

        /* 2️⃣ Close repayment schedule */
        RepaymentSchedule schedule = repaymentRepo.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Repayment schedule not found"));

        schedule.setClosed(true);
        schedule.setOutstandingAmount(BigDecimal.ZERO);
        schedule.setNextEmiDate(null);
        schedule.setNextEmiAmount(BigDecimal.ZERO);

        schedule.getEmis().forEach(emi -> {
            if (emi.getStatus() != RepaymentStatus.PAID) {
                emi.setStatus(RepaymentStatus.PAID);
                emi.setPaidAmount(emi.getEmiAmount());
                emi.setPaidAt(Instant.now());
            }
        });

        schedule.setUpdatedAt(Instant.now());
        repaymentRepo.save(schedule);

        /* 3️⃣ Close loan */
        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus(LoanStatus.CLOSED);
        loan.setClosedAt(Instant.now());
        loan.setUpdatedAt(Instant.now());

        cibilScoreService.applyEvent(
                userId,
                CibilEventType.LOAN_CLOSED_OTS
        );

        loanRepository.save(loan);
    }
}

