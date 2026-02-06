package com.lms.eligibility.service;

import com.lms.common.enums.LoanStatus;
import com.lms.eligibility.context.EligibilityContext;
import com.lms.eligibility.dto.EligibilityResult;
import com.lms.eligibility.factory.EligibilityStrategyFactory;
import com.lms.eligibility.strategy.LoanEligibilityStrategy;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EligibilityService {

    private final LoanRepository loanRepository;
    private final EligibilityStrategyFactory strategyFactory;

    @Transactional
    public EligibilityResult checkEligibility(String loanId, String userId) {

        /* Fetch loan (ownership validated at DB level) */
        Loan loan = loanRepository.findByLoanIdAndUserId(loanId, userId)
                .orElseThrow(() -> new RuntimeException("Loan not found or unauthorized"));

        /* Guard: prevent re-evaluation */
        if (loan.getEligibilityCheckedAt() != null) {
            throw new IllegalStateException("Eligibility already evaluated for this loan");
        }

        /* Guard: state validation */
        if (loan.getStatus() != LoanStatus.APPLIED) {
            throw new IllegalStateException("Eligibility check allowed only in APPLIED state");
        }

        /* Build eligibility context */
        EligibilityContext context = buildContextFromLoan(loan);

        /* Strategy selection */
        LoanEligibilityStrategy strategy =
                strategyFactory.getStrategy(loan.getLoanType());

        /* Evaluate */
        EligibilityResult result = strategy.evaluate(context);

        /* Persist result */
        updateLoanWithEligibility(loan, result);

        return result;
    }

    private EligibilityContext buildContextFromLoan(Loan loan) {

        EligibilityContext.EligibilityContextBuilder builder =
                EligibilityContext.builder()
                        .loanId(loan.getLoanId())
                        .loanType(loan.getLoanType())
                        .requestedAmount(loan.getLoanAmount())
                        .tenureMonths(loan.getTenureMonths())
                        .cibilScore(loan.getCibilScore());

        switch (loan.getLoanType()) {

            case PERSONAL -> {
                if (loan.getPersonalLoanDetails() == null) {
                    throw new IllegalStateException("Missing personal loan details");
                }
                builder.monthlyIncome(
                                loan.getPersonalLoanDetails().getMonthlyIncome())
                        .employmentType(
                                loan.getPersonalLoanDetails().getEmploymentType());
            }

            case EDUCATION -> {
                if (loan.getEducationLoanDetails() == null) {
                    throw new IllegalStateException("Missing education loan details");
                }
                builder.coApplicantIncome(
                                loan.getEducationLoanDetails().getCoApplicantIncome())
                        .courseDurationMonths(
                                loan.getEducationLoanDetails().getCourseDurationMonths());
            }

            case BUSINESS -> {
                if (loan.getBusinessLoanDetails() == null) {
                    throw new IllegalStateException("Missing business loan details");
                }
                builder.annualTurnover(
                                loan.getBusinessLoanDetails().getGstAnnualTurnover())
                        .businessVintageYears(
                                loan.getBusinessLoanDetails().getBusinessVintageYears());
            }

            case VEHICLE -> {
                if (loan.getVehicleLoanDetails() == null) {
                    throw new IllegalStateException("Missing vehicle loan details");
                }
                builder.downPaymentAmount(
                                loan.getVehicleLoanDetails().getDownPaymentAmount())
                        .vehicleType(
                                loan.getVehicleLoanDetails().getVehicleType());
            }
        }

        return builder.build();
    }

    private void updateLoanWithEligibility(Loan loan, EligibilityResult result) {

        loan.setEligibilityScore(result.getScore());
        loan.setEligibilityRemarks(result.getRemarks());
        loan.setEligibilityCheckedAt(LocalDateTime.now());
        loan.setEmiEligible(result.isEligible());
        loan.setEligibilityPassedRules(result.getPassedRules());
        loan.setEligibilityFailedRules(result.getFailedRules());
        loan.setStatus(result.getNewStatus());





        if (result.isEligible()) {
            loan.setStatus(LoanStatus.PENDING_BRANCH_REVIEW);
            loan.setApprovedAmount(result.getApprovedAmount());
            loan.setApprovedDate(LocalDateTime.now().toLocalDate());
        } else {
            loan.setStatus(LoanStatus.NOT_ELIGIBLE);
        }

        loan.setUpdatedAt(LocalDateTime.now());
        loanRepository.save(loan);
    }
}
