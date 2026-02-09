package com.lms.eligibility.service;

import com.lms.common.enums.LoanStatus;
import com.lms.common.util.EmiCalculator;
import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.factory.EligibilityStrategyFactory;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EligibilityService {

    private final LoanRepository loanRepository;
    private final EligibilityStrategyFactory strategyFactory;
    private final UserRepository userRepository; // 🔥 REQUIRED

    @Transactional
    public EligibilityResult checkEligibilityForBranch(String loanId)
    {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found or unauthorized"));

        if (loan.getStatus() != LoanStatus.APPLIED &&
                loan.getStatus() != LoanStatus.UNDER_BRANCH_REVIEW) {
            throw new IllegalStateException(
                    "Eligibility cannot be checked in status: " + loan.getStatus());
        }

        EligibilityContext context = buildContextFromLoan(loan, loan.getUserId());

        LoanEligibilityStrategy strategy =
                strategyFactory.getStrategy(loan.getLoanType());

        EligibilityResult result = strategy.evaluate(context);

        updateLoanWithEligibility(loan, result);

        return result;
    }

    private BigDecimal getInterestRateByLoanType(Loan loan) {
        return switch (loan.getLoanType()) {
            case PERSONAL -> new BigDecimal("11.5");
            case EDUCATION -> new BigDecimal("8.5");
            case BUSINESS -> new BigDecimal("13.0");
            case VEHICLE -> new BigDecimal("9.5");
        };
    }


    private EligibilityContext buildContextFromLoan(Loan loan, String userId) {

        //  Fetch user separately (Loan has only userId)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EligibilityContext.EligibilityContextBuilder builder =
                EligibilityContext.builder()
                        .loanId(loan.getLoanId())
                        .loanType(loan.getLoanType())
                        .requestedAmount(loan.getLoanAmount())
                        .tenureMonths(loan.getTenureMonths())
                        .cibilScore(loan.getCibilScore())
                        .dateOfBirth(user.getDateOfBirth()); // ✅ FIXED

        switch (loan.getLoanType()) {

            case PERSONAL -> {
                if (loan.getPersonalLoanDetails() == null) {
                    throw new IllegalStateException("Missing personal loan details");
                }
                builder
                        .monthlyIncome(
                                loan.getPersonalLoanDetails().getMonthlyIncome())
                        .employmentType(
                                loan.getPersonalLoanDetails().getEmploymentType());
            }

            case EDUCATION -> {
                if (loan.getEducationLoanDetails() == null) {
                    throw new IllegalStateException("Missing education loan details");
                }
                builder
                        .coApplicantIncome(
                                loan.getEducationLoanDetails().getCoApplicantIncome())
                        .courseDurationMonths(
                                loan.getEducationLoanDetails().getCourseDurationMonths());
            }

            case BUSINESS -> {
                if (loan.getBusinessLoanDetails() == null) {
                    throw new IllegalStateException("Missing business loan details");
                }
                builder
                        .annualTurnover(
                                loan.getBusinessLoanDetails().getGstAnnualTurnover())
                        .businessVintageYears(
                                loan.getBusinessLoanDetails().getBusinessVintageYears());
            }

            case VEHICLE -> {
                if (loan.getVehicleLoanDetails() == null) {
                    throw new IllegalStateException("Missing vehicle loan details");
                }
                builder
                        .downPaymentAmount(
                                loan.getVehicleLoanDetails().getDownPaymentAmount());
            }
        }

        return builder.build(); // ✅ REQUIRED
    }

    private void updateLoanWithEligibility(Loan loan, EligibilityResult result) {

        loan.setEligibilityCheckedAt(LocalDateTime.now());

        if (result.isEligible()) {

            BigDecimal interestRate = getInterestRateByLoanType(loan);

            BigDecimal emi = EmiCalculator.calculateEmi(
                    result.getApprovedAmount(),
                    interestRate,
                    loan.getTenureMonths()
            );

            loan.setStatus(LoanStatus.UNDER_BRANCH_REVIEW);
            loan.setApprovedAmount(result.getApprovedAmount());
            loan.setInterestRate(interestRate);
            loan.setEmiAmount(emi);
            loan.setApprovedDate(LocalDate.now());
            loan.setEmiEligible(true);

        } else {
            loan.setStatus(LoanStatus.NOT_ELIGIBLE);
            loan.setEmiAmount(BigDecimal.ZERO);
            loan.setEmiEligible(false);
        }

        loan.setUpdatedAt(LocalDateTime.now());
        loanRepository.save(loan);
    }

}
