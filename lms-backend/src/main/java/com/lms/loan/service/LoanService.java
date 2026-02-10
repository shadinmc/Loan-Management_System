
package com.lms.loan.service;

import com.lms.common.idempotency.IdempotencyKeyService;
import com.lms.common.idempotency.IdempotencyRecord;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.dto.*;
import com.lms.loan.entity.Loan;
import com.lms.loan.entity.embedded.*;
import com.lms.loan.repository.LoanRepository;
import org.springframework.stereotype.Service;
import com.lms.kyc.service.KycService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final IdempotencyKeyService idempotencyKeyService;
    private final KycService kycService;


    public LoanService(LoanRepository loanRepository,
                       IdempotencyKeyService idempotencyKeyService,KycService kycService) {
        this.loanRepository = loanRepository;
        this.idempotencyKeyService = idempotencyKeyService;
        this.kycService = kycService;
    }

    private String generateLoanId() {
        return "LN-" + LocalDate.now().getYear() + "-" + System.currentTimeMillis();
    }

    public Loan applyForLoan(String userId, LoanApplicationRequest request, String idempotencyKey) {


        kycService.validateKycVerified(userId);

        //  Step 1: Check if this request was already processed
        Optional<IdempotencyRecord> recordOpt =
                idempotencyKeyService.findByKey(idempotencyKey);

        if (recordOpt.isPresent()) {

            IdempotencyRecord record = recordOpt.get();

            //  If expired → treat as new request
            if (record.getExpiresAt().isBefore(java.time.Instant.now())) {
                // continue normally (create new loan)
            } else {
                //  Replay case
                Optional<Loan> existingLoan =
                        loanRepository.findByLoanId(record.getResourceId());

                if (existingLoan.isPresent()) {
                    return existingLoan.get(); // replay response
                }
                // else orphan record → continue to create new loan
            }
        }


        //  Step 2: Validate request
        validateLoanRequest(request);

        //  Step 3: Create base loan
        Loan loan = Loan.builder()
                .loanId(generateLoanId())
                .userId(userId)
                .loanType(request.getLoanType())
                .loanAmount(BigDecimal.valueOf(request.getLoanAmount()))
                .tenureMonths(request.getTenureMonths())
                .interestRate(BigDecimal.valueOf(request.getInterestRate()))
                .cibilScore(kycService.getCibilScore(userId))
                .status(LoanStatus.APPLIED)
                .appliedDate(LocalDate.now())
                .outstandingPrincipal(BigDecimal.valueOf(request.getLoanAmount()))
                .emiEligible(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        //  Step 4: Attach loan-type specific details
        switch (request.getLoanType()) {
            case PERSONAL -> loan.setPersonalLoanDetails(mapPersonalLoan(request));
            case EDUCATION -> loan.setEducationLoanDetails(mapEducationLoan(request));
            case BUSINESS -> loan.setBusinessLoanDetails(mapBusinessLoan(request));
            case VEHICLE -> loan.setVehicleLoanDetails(mapVehicleLoan(request));
            default -> throw new IllegalArgumentException("Unsupported loan type: " + request.getLoanType());
        }

        //  Step 5: Save loan
        Loan savedLoan = loanRepository.save(loan);

        //  Step 6: Save idempotency record to prevent future duplicates
        idempotencyKeyService.saveKey(idempotencyKey, savedLoan.getLoanId(), "LOAN_APPLICATION");

        return savedLoan;
    }

    public Loan resubmitLoan(
            String loanId,
            String userId,
            LoanApplicationRequest updatedRequest
    ) {
        Loan loan = loanRepository.findByLoanIdAndUserId(loanId, userId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.CLARIFICATION_REQUIRED) {
            throw new IllegalStateException("Loan not eligible for resubmission");
        }

        switch (loan.getLoanType()) {

            case PERSONAL -> {
                PersonalLoanDetails incoming =
                        toPersonalEntity(updatedRequest.getPersonalLoanDetails());

                if (incoming != null) {
                    if (loan.getPersonalLoanDetails() == null) {
                        loan.setPersonalLoanDetails(incoming);
                    } else {
                        mergeNonNullFields(incoming, loan.getPersonalLoanDetails());
                    }
                }
            }

            case EDUCATION -> {
                EducationLoanDetails incoming =
                        toEducationEntity(updatedRequest.getEducationLoanDetails());

                if (incoming != null) {
                    if (loan.getEducationLoanDetails() == null) {
                        loan.setEducationLoanDetails(incoming);
                    } else {
                        mergeNonNullFields(incoming, loan.getEducationLoanDetails());
                    }
                }
            }

            case BUSINESS -> {
                BusinessLoanDetails incoming =
                        toBusinessEntity(updatedRequest.getBusinessLoanDetails());

                if (incoming != null) {
                    if (loan.getBusinessLoanDetails() == null) {
                        loan.setBusinessLoanDetails(incoming);
                    } else {
                        mergeNonNullFields(incoming, loan.getBusinessLoanDetails());
                    }
                }
            }

            case VEHICLE -> {
                VehicleLoanDetails incoming =
                        toVehicleEntity(updatedRequest.getVehicleLoanDetails());

                if (incoming != null) {
                    if (loan.getVehicleLoanDetails() == null) {
                        loan.setVehicleLoanDetails(incoming);
                    } else {
                        mergeNonNullFields(incoming, loan.getVehicleLoanDetails());
                    }
                }
            }
        }

        loan.setStatus(LoanStatus.APPLIED);
        loan.setDecisionMessage(null);
        loan.setUpdatedAt(LocalDateTime.now());

        return loanRepository.save(loan);
    }




    public Loan getLoanById(String loanId) {
        return loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found: " + loanId));
    }

    public List<Loan> getLoansByUserId(String userId) {
        return loanRepository.findByUserId(userId);
    }

    public Loan getLoanByIdAndUserId(String loanId, String userId) {
        return loanRepository.findByLoanIdAndUserId(loanId, userId)
                .orElseThrow(() -> new RuntimeException("Loan not found or access denied"));
    }

    public List<Loan> getLoansForBranchReview() {
        return loanRepository.findByStatus(LoanStatus.ELIGIBILITY_CHECK_PASSED);
    }

    public List<Loan> getLoansByStatus(LoanStatus status) {
        return loanRepository.findByStatus(status);
    }

    public Loan updateLoan(Loan loan) {
        loan.setUpdatedAt(LocalDateTime.now());
        return loanRepository.save(loan);
    }

    // ... keep all your existing private methods (validateLoanRequest, mappers) ...

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


    private <T> void mergeNonNullFields(T source, T target) {
        if (source == null || target == null) return;

        if (!source.getClass().equals(target.getClass())) {
            throw new IllegalArgumentException("Source and target must be same type");
        }

        for (var field : source.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                Object value = field.get(source);
                if (value != null) {
                    field.set(target, value);
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
    }



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
                .calculatedEligibleAmount(null)
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

    private EducationLoanDetails toEducationEntity(EducationLoanDetailsDto dto) {
        if (dto == null) return null;

        EducationLoanDetails e = new EducationLoanDetails();
        e.setCourseName(dto.getCourseName());
        e.setCourseDurationMonths(dto.getCourseDurationMonths());
        e.setCoApplicantName(dto.getCoApplicantName());
        e.setCoApplicantIncome(dto.getCoApplicantIncome());
        e.setRelationship(dto.getRelationship());
        e.setProofOfAdmission(dto.getProofOfAdmission());
        e.setProofOfIncome(dto.getProofOfIncome());
        e.setProofOfAddress(dto.getProofOfAddress());
        e.setCollateralDocuments(dto.getCollateralDocuments());
        return e;
    }

    private PersonalLoanDetails toPersonalEntity(PersonalLoanDetailsDto dto) {
        if (dto == null) return null;

        PersonalLoanDetails e = new PersonalLoanDetails();
        e.setEmploymentType(dto.getEmploymentType());
        e.setMonthlyIncome(dto.getMonthlyIncome());
        e.setEmployerName(dto.getEmployerName());
        e.setProofOfIdentity(dto.getProofOfIdentity());
        e.setProofOfIncome(dto.getProofOfIncome());
        e.setProofOfAddress(dto.getProofOfAddress());
        return e;
    }

    private BusinessLoanDetails toBusinessEntity(BusinessLoanDetailsDto dto) {
        if (dto == null) return null;

        BusinessLoanDetails e = new BusinessLoanDetails();
        e.setBusinessName(dto.getBusinessName());
        e.setBusinessType(dto.getBusinessType());
        e.setGstAnnualTurnover(dto.getGstAnnualTurnover());
        e.setBusinessVintageYears(dto.getBusinessVintageYears());
        e.setProofOfBusiness(dto.getProofOfBusiness());
        e.setProofOfIncome(dto.getProofOfIncome());
        return e;
    }

    private VehicleLoanDetails toVehicleEntity(VehicleLoanDetailsDto dto) {
        if (dto == null) return null;

        VehicleLoanDetails e = new VehicleLoanDetails();
        e.setVehicleType(dto.getVehicleType());
        e.setVehicleBrand(dto.getVehicleBrand());
        e.setVehicleModel(dto.getVehicleModel());
        e.setDownPaymentAmount(dto.getDownPaymentAmount());
        e.setDealerName(dto.getDealerName());
        e.setProofOfIdentity(dto.getProofOfIdentity());
        e.setProofOfIncome(dto.getProofOfIncome());
        e.setInsuranceProof(dto.getInsuranceProof());
        e.setDownPaymentProof(dto.getDownPaymentProof());
        return e;
    }

}
