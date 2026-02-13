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

@Service
@RequiredArgsConstructor
public class OtsService {

    private final RepaymentScheduleRepository repaymentRepo;
    private final LoanRepository loanRepository;
    private final WalletService walletService;
    private final SecurityUtils securityUtils;
    private final CibilScoreService cibilScoreService;

    private static final BigDecimal OTS_RATE_FACTOR = new BigDecimal("0.6");

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

        RepaymentSchedule schedule =
                repaymentRepo.findByLoanId(loanId)
                        .orElseThrow(() ->
                                new RuntimeException("Repayment schedule not found"));

        BigDecimal outstanding = schedule.getOutstandingAmount();

        long remainingMonths = schedule.getEmis().stream()
                .filter(e ->
                        e.getStatus() == RepaymentStatus.PENDING ||
                                e.getStatus() == RepaymentStatus.OVERDUE)
                .count();

        BigDecimal otsRate =
                loan.getInterestRate().multiply(OTS_RATE_FACTOR);

        BigDecimal reducedInterest =
                outstanding
                        .multiply(otsRate)
                        .multiply(BigDecimal.valueOf(remainingMonths))
                        .divide(BigDecimal.valueOf(12 * 100), 2, RoundingMode.HALF_UP);

        BigDecimal totalPenalty = schedule.getEmis().stream()
                .map(Emi::getPenaltyAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Penalty waiver logic
        BigDecimal penaltyWaiver =
                totalPenalty.compareTo(BigDecimal.ZERO) > 0
                        ? totalPenalty.multiply(new BigDecimal("0.5"))
                        : totalPenalty;

        BigDecimal settlementAmount =
                outstanding
                        .add(reducedInterest)
                        .add(totalPenalty)
                        .subtract(penaltyWaiver);

        return new OtsQuoteResponse(
                outstanding,
                reducedInterest,
                totalPenalty,
                penaltyWaiver,
                settlementAmount,
                (int) remainingMonths
        );
    }

    @Transactional
    public void settle(String loanId, BigDecimal amount) {

        String userId = securityUtils.getCurrentUserId();

        OtsQuoteResponse quote = getQuote(loanId);

        if (amount.compareTo(quote.getSettlementAmount()) != 0) {
            throw new RuntimeException("Settlement amount mismatch");
        }

        // 1️⃣ Debit wallet
        walletService.withdraw(loanId, amount);

        // 2️⃣ Close repayment schedule
        RepaymentSchedule schedule =
                repaymentRepo.findByLoanId(loanId).get();

        schedule.setClosed(true);
        schedule.setOutstandingAmount(BigDecimal.ZERO);
        schedule.setNextEmiDate(null);
        schedule.setNextEmiAmount(BigDecimal.ZERO);

        schedule.getEmis().forEach(emi -> {
            if (emi.getStatus() != RepaymentStatus.PAID) {
                emi.setStatus(RepaymentStatus.PAID);
                emi.setPaidAt(Instant.now());
            }
        });

        schedule.setUpdatedAt(Instant.now());
        repaymentRepo.save(schedule);

        // 3️⃣ Close loan
        Loan loan = loanRepository.findByLoanId(loanId).get();
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

