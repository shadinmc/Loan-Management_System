package com.lms.loan.service;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.entity.Loan;
import com.lms.loan.entity.embedded.*;
import com.lms.loan.repository.LoanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;

    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }
    private String generateLoanId() {
        return "LN-" + LocalDate.now().getYear() + "-" + System.currentTimeMillis();
    }
    public Loan applyForLoan(String userId, LoanApplicationRequest request) {
        validateLoanRequest(request);

        // 1️⃣ Create base loan (common fields only)
        Loan loan = Loan.builder()
                .loanId(generateLoanId())   // 👈 ADD THIS
                .userId(userId)
                .loanType(request.getLoanType())
                .loanAmount(request.getLoanAmount())
                .tenureMonths(request.getTenureMonths())
                .interestRate(request.getInterestRate())
                .status(LoanStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .outstandingPrincipal(request.getLoanAmount())
                .emiEligible(false)
                .build();

        // 2️⃣ Attach loan-type specific details
        switch (request.getLoanType()) {

            case PERSONAL -> loan.setPersonalLoanDetails(
                    mapPersonalLoan(request)
            );

            case EDUCATION -> loan.setEducationLoanDetails(
                    mapEducationLoan(request)
            );

            case BUSINESS -> loan.setBusinessLoanDetails(
                    mapBusinessLoan(request)
            );

            case VEHICLE -> loan.setVehicleLoanDetails(
                    mapVehicleLoan(request)
            );

            default -> throw new IllegalArgumentException(
                    "Unsupported loan type: " + request.getLoanType()
            );
        }

        // 3️⃣ Persist
        return loanRepository.save(loan);
    }
    public Loan getLoanById(String loanId) {
        return loanRepository.findByLoanId(loanId)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found: " + loanId)
                );
    }

    private void validateLoanRequest(LoanApplicationRequest request) {

        if (request.getLoanType() == null) {
            throw new IllegalArgumentException("Loan type is mandatory");
        }

        switch (request.getLoanType()) {

            case PERSONAL -> {
                if (request.getPersonalLoanDetails() == null) {
                    throw new IllegalArgumentException("Personal loan details required");
                }
            }

            case EDUCATION -> {
                if (request.getEducationLoanDetails() == null) {
                    throw new IllegalArgumentException("Education loan details required");
                }
            }

            case BUSINESS -> {
                if (request.getBusinessLoanDetails() == null) {
                    throw new IllegalArgumentException("Business loan details required");
                }
            }

            case VEHICLE -> {
                if (request.getVehicleLoanDetails() == null) {
                    throw new IllegalArgumentException("Vehicle loan details required");
                }
            }
        }
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }



    // ---------------- MAPPERS ----------------

    private PersonalLoanDetails mapPersonalLoan(LoanApplicationRequest request) {
        return PersonalLoanDetails.builder()
                .employmentType(request.getPersonalLoanDetails().getEmploymentType())
                .monthlyIncome(request.getPersonalLoanDetails().getMonthlyIncome())
                .employerName(request.getPersonalLoanDetails().getEmployerName())
                .proofOfIdentity(request.getPersonalLoanDetails().getProofOfIdentity())
                .proofOfIncome(request.getPersonalLoanDetails().getProofOfIncome())
                .proofOfAddress(request.getPersonalLoanDetails().getProofOfAddress())
                .applicationStatus("SUBMITTED")
                .build();
    }

    private EducationLoanDetails mapEducationLoan(LoanApplicationRequest request) {
        return EducationLoanDetails.builder()
                .courseName(request.getEducationLoanDetails().getCourseName())
                .courseDurationMonths(request.getEducationLoanDetails().getCourseDurationMonths())
                .coApplicantName(request.getEducationLoanDetails().getCoApplicantName())
                .coApplicantIncome(request.getEducationLoanDetails().getCoApplicantIncome())
                .relationship(request.getEducationLoanDetails().getRelationship())
                .proofOfAdmission(request.getEducationLoanDetails().getProofOfAdmission())
                .proofOfIncome(request.getEducationLoanDetails().getProofOfIncome())
                .proofOfAddress(request.getEducationLoanDetails().getProofOfAddress())
                .collateralDocuments(request.getEducationLoanDetails().getCollateralDocuments())
                .build();
    }

    private BusinessLoanDetails mapBusinessLoan(LoanApplicationRequest request) {
        return BusinessLoanDetails.builder()
                .businessName(request.getBusinessLoanDetails().getBusinessName())
                .businessType(request.getBusinessLoanDetails().getBusinessType())
                .gstAnnualTurnover(request.getBusinessLoanDetails().getGstAnnualTurnover())
                .businessVintageYears(request.getBusinessLoanDetails().getBusinessVintageYears())
                .proofOfBusiness(request.getBusinessLoanDetails().getProofOfBusiness())
                .proofOfIncome(request.getBusinessLoanDetails().getProofOfIncome())
                .calculatedEligibleAmount(null) // calculated later
                .build();
    }

    private VehicleLoanDetails mapVehicleLoan(LoanApplicationRequest request) {
        return VehicleLoanDetails.builder()
                .vehicleType(request.getVehicleLoanDetails().getVehicleType())
                .vehicleBrand(request.getVehicleLoanDetails().getVehicleBrand())
                .vehicleModel(request.getVehicleLoanDetails().getVehicleModel())
                .downPaymentAmount(request.getVehicleLoanDetails().getDownPaymentAmount())
                .dealerName(request.getVehicleLoanDetails().getDealerName())
                .proofOfIdentity(request.getVehicleLoanDetails().getProofOfIdentity())
                .proofOfIncome(request.getVehicleLoanDetails().getProofOfIncome())
                .insuranceProof(request.getVehicleLoanDetails().getInsuranceProof())
                .downPaymentProof(request.getVehicleLoanDetails().getDownPaymentProof())
                .build();
    }
}
