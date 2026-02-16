package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.audit.service.AuditService;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtsService {

    private final RepaymentScheduleRepository repaymentRepo;
    private final LoanRepository loanRepository;
    private final WalletService walletService;
    private final SecurityUtils securityUtils;
    private final CibilScoreService cibilScoreService;
    private final AuditService auditService;

    /** Customer pays only 60% of remaining EMIs */
    private static final BigDecimal OTS_DISCOUNT_FACTOR = new BigDecimal("0.60");
    /** 0.5% per month */
    private static final BigDecimal OTS_HOLDING_FEE_RATE = new BigDecimal("0.005");

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

        List<Emi> remainingEmis = (schedule.getEmis() == null ? List.<Emi>of() : schedule.getEmis())
                .stream()
                .filter(e -> e.getStatus() == RepaymentStatus.PENDING || e.getStatus() == RepaymentStatus.OVERDUE)
                .toList();

        int remainingMonths = remainingEmis.size();

        BigDecimal remainingEmiTotal = remainingEmis.stream()
                .map(emi -> emi.getEmiAmount() == null ? BigDecimal.ZERO : emi.getEmiAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountedOutstanding = remainingEmiTotal
                .multiply(OTS_DISCOUNT_FACTOR)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalPenalty = remainingEmis.stream()
                .map(emi -> emi.getPenaltyAmount() == null ? BigDecimal.ZERO : emi.getPenaltyAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal penaltyWaiver = totalPenalty
                .multiply(new BigDecimal("0.50"))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal settlementAmount = discountedOutstanding
                .add(totalPenalty.subtract(penaltyWaiver))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal principalFloor = loan.getOutstandingPrincipal() == null
                ? BigDecimal.ZERO
                : loan.getOutstandingPrincipal();

        if (settlementAmount.compareTo(principalFloor) < 0) {
            settlementAmount = principalFloor;
        }

        Instant startInstant = loan.getActivatedAt();
        if (startInstant == null) {
            startInstant = loan.getDisbursedDate();
        }
        if (startInstant == null) {
            startInstant = Instant.now();
        }

        long monthsUsed = ChronoUnit.MONTHS.between(
                startInstant.atZone(ZoneOffset.UTC).toLocalDate(),
                Instant.now().atZone(ZoneOffset.UTC).toLocalDate()
        );

        BigDecimal holdingFee = principalFloor
                .multiply(OTS_HOLDING_FEE_RATE)
                .multiply(BigDecimal.valueOf(Math.max(monthsUsed, 1)))
                .setScale(2, RoundingMode.HALF_UP);

        settlementAmount = settlementAmount
                .add(holdingFee)
                .setScale(2, RoundingMode.HALF_UP);

        return new OtsQuoteResponse(
                remainingEmiTotal,
                remainingEmiTotal.subtract(discountedOutstanding),
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

        walletService.withdraw(loanId, amount);

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

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus(LoanStatus.CLOSED);
        loan.setClosedAt(Instant.now());
        loan.setUpdatedAt(Instant.now());

        cibilScoreService.applyEvent(userId, CibilEventType.LOAN_CLOSED_OTS);

        loanRepository.save(loan);

        try {
            Map<String, Object> requestPayload = Map.of(
                    "loanId", loanId,
                    "amount", amount,
                    "settlementAmount", quote.getSettlementAmount()
            );

            Map<String, Object> responsePayload = Map.of(
                    "currentStatus", loan.getStatus(),
                    "closedAt", loan.getClosedAt()
            );

            auditService.log(
                    userId,
                    "OTS_SETTLEMENT",
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
