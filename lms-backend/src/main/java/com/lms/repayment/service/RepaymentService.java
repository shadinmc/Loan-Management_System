package com.lms.repayment.service;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.entity.Repayment;
import com.lms.repayment.repository.RepaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RepaymentService {

    private final LoanRepository loanRepository;
    private final RepaymentRepository repaymentRepository;

    public Repayment payEmi(String loanId, BigDecimal amount) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new IllegalStateException("Loan is not active for repayment");
        }

        if (loan.getOutstandingPrincipal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Loan already fully paid");
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid payment amount");
        }

        BigDecimal monthlyRate =
                loan.getInterestRate()
                        .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                        .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);

        BigDecimal interestComponent =
                loan.getOutstandingPrincipal()
                        .multiply(monthlyRate)
                        .setScale(2, RoundingMode.HALF_UP);

        BigDecimal principalComponent =
                amount.subtract(interestComponent);

        if (principalComponent.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("Payment too small to cover interest");
        }

        BigDecimal newOutstanding =
                loan.getOutstandingPrincipal()
                        .subtract(principalComponent)
                        .max(BigDecimal.ZERO);

        long emiCount = repaymentRepository.countByLoanId(loanId);

        Repayment repayment = Repayment.builder()
                .loanId(loanId)
                .emiNumber((int) emiCount + 1)
                .amountPaid(amount)
                .principalComponent(principalComponent)
                .interestComponent(interestComponent)
                .remainingPrincipal(newOutstanding)
                .paidAt(LocalDateTime.now())
                .transactionId("PAY-" + System.currentTimeMillis())
                .build();

        repaymentRepository.save(repayment);

        loan.setOutstandingPrincipal(newOutstanding);
        loan.setUpdatedAt(LocalDateTime.now());

        if (newOutstanding.compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanStatus.CLOSED);
        }

        loanRepository.save(loan);

        return repayment;
    }

    public List<Repayment> getLoanRepayments(String loanId) {
        return repaymentRepository.findByLoanIdOrderByEmiNumberAsc(loanId);
    }
}
