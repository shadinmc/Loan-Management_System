package com.lms.testutil;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.repayment.entity.Emi;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class TestDataFactory {

    private TestDataFactory() {
    }

    public static Loan disbursementPendingLoan(
            String loanId,
            String userId,
            BigDecimal amount,
            Instant scheduledAt
    ) {
        return Loan.builder()
                .loanId(loanId)
                .userId(userId)
                .approvedAmount(amount)
                .status(LoanStatus.DISBURSEMENT_PENDING)
                .disbursementScheduledAt(scheduledAt)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public static Loan disbursedLoanReadyForActivation(
            String loanId,
            String userId,
            BigDecimal emiAmount,
            int tenureMonths,
            Instant activationAt
    ) {
        return Loan.builder()
                .loanId(loanId)
                .userId(userId)
                .emiAmount(emiAmount)
                .tenureMonths(tenureMonths)
                .approvedAmount(emiAmount.multiply(BigDecimal.valueOf(tenureMonths)))
                .status(LoanStatus.DISBURSED)
                .activationScheduledAt(activationAt)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public static Loan activatedLoanForSchedule(
            String loanId,
            String userId,
            BigDecimal emiAmount,
            int tenureMonths,
            Instant activatedAt
    ) {
        return Loan.builder()
                .loanId(loanId)
                .userId(userId)
                .emiAmount(emiAmount)
                .tenureMonths(tenureMonths)
                .activatedAt(activatedAt)
                .status(LoanStatus.ACTIVE)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public static RepaymentSchedule overdueSchedule(
            String loanId,
            String userId,
            BigDecimal emiAmount,
            Instant dueDate,
            Instant lastPenaltyAppliedAt
    ) {
        Emi emi = Emi.builder()
                .emiNumber(1)
                .dueDate(dueDate)
                .emiAmount(emiAmount)
                .paidAmount(BigDecimal.ZERO)
                .penaltyAmount(BigDecimal.ZERO)
                .status(RepaymentStatus.PENDING)
                .lastPenaltyAppliedAt(lastPenaltyAppliedAt)
                .build();

        return RepaymentSchedule.builder()
                .loanId(loanId)
                .userId(userId)
                .emis(List.of(emi))
                .totalPayableAmount(emiAmount)
                .totalPaidAmount(BigDecimal.ZERO)
                .outstandingAmount(emiAmount)
                .nextEmiDate(dueDate)
                .nextEmiAmount(emiAmount)
                .closed(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }
}
