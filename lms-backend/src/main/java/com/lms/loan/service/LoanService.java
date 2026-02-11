package com.lms.loan.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.common.idempotency.IdempotencyKeyService;
import com.lms.common.idempotency.IdempotencyRecord;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.dto.LoanApplicationRequest;
import com.lms.loan.entity.Loan;
import com.lms.loan.entity.embedded.*;
import com.lms.loan.repository.LoanRepository;
import com.lms.kyc.service.KycService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final IdempotencyKeyService idempotencyService;
    private final KycService kycService;
    private final AuditService auditService;
    private final SecurityUtils securityUtils;


    public LoanService(
            LoanRepository loanRepository,
            IdempotencyKeyService idempotencyService,
            KycService kycService, AuditService auditService, SecurityUtils securityUtils
    ) {
        this.loanRepository = loanRepository;
        this.idempotencyService = idempotencyService;
        this.kycService = kycService;
        this.auditService = auditService;
        this.securityUtils = securityUtils;
    }

    /**
     * Generate unique loan ID
     */
    private String generateLoanId() {
        return "LN-" + LocalDate.now().getYear() + "-" + System.currentTimeMillis();
    }

    /**
     * Apply for a loan with idempotency support
     * Prevents duplicate loan applications within the idempotency window
     */
    @Transactional
    public Loan applyForLoan( LoanApplicationRequest request, String idempotencyKey) {
        String userId = securityUtils.getCurrentUserId();
        // Step 0: Validate KYC
        kycService.validateKycVerified(userId);

        // Step 1: Check idempotency - prevent duplicate submissions
        Optional<IdempotencyRecord> existingRecord = idempotencyService.findByKey(idempotencyKey);

        if (existingRecord.isPresent()) {
            IdempotencyRecord record = existingRecord.get();

            // Check if record has expired
            if (record.getExpiresAt().isBefore(java.time.Instant.now())) {
                // Expired - allow new submission (but don't delete old record)
                // Continue to create new loan
            } else {
                // Valid record exists - return existing loan (idempotent replay)
                Optional<Loan> existingLoan = loanRepository.findByLoanId(record.getResourceId());

                if (existingLoan.isPresent()) {
                    // Return the previously created loan
                    return existingLoan.get();
                }
                // If loan was deleted but record exists, continue to create new loan
            }
        }

        // Step 2: Validate request
        validateLoanRequest(request);

        // Step 3: Create base loan entity
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

        // Step 4: Attach loan-type specific details
        switch (request.getLoanType()) {
            case PERSONAL -> loan.setPersonalLoanDetails(mapPersonalLoan(request));
            case EDUCATION -> loan.setEducationLoanDetails(mapEducationLoan(request));
            case BUSINESS -> loan.setBusinessLoanDetails(mapBusinessLoan(request));
            case VEHICLE -> loan.setVehicleLoanDetails(mapVehicleLoan(request));
            default -> throw new IllegalArgumentException(
                    "Unsupported loan type: " + request.getLoanType()
            );
        }

        // Step 5: Persist loan to database
        Loan savedLoan = loanRepository.save(loan);

        auditService.log(
                userId,
                "LOAN_APPLICATION",
                "LOAN",
                savedLoan.getLoanId(),
                request,
                savedLoan,
                201,
                true
        );

        // Step 6: Save idempotency record to prevent future duplicates
        idempotencyService.saveKey(
                idempotencyKey,
                savedLoan.getLoanId(),
                "LOAN_APPLICATION"
        );

        return savedLoan;
    }

    /**
     * Get loan by loan ID
     */
    public Loan getLoanById(String loanId) {
        return loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found: " + loanId));
    }

    /**
     * Get all loans for a specific user
     */
    public List<Loan> getLoansByUserId(String userId) {
        return loanRepository.findByUserId(userId);
    }

    /**
     * Get loan by ID and verify user ownership
     */
    public Loan getLoanByIdAndUserId(String loanId, String userId) {
        return loanRepository.findByLoanIdAndUserId(loanId, userId)
                .orElseThrow(() -> new RuntimeException("Loan not found or access denied"));
    }

    /**
     * Get loans pending branch review
     */
    public List<Loan> getLoansForBranchReview() {
        return loanRepository.findByStatus(LoanStatus.ELIGIBILITY_CHECK_PASSED);
    }

    /**
     * Get loans by status
     */
    public List<Loan> getLoansByStatus(LoanStatus status) {
        return loanRepository.findByStatus(status);
    }

    /**
     * Update existing loan
     */
    @Transactional
    public Loan updateLoan(Loan loan) {
        loan.setUpdatedAt(LocalDateTime.now());
        return loanRepository.save(loan);
    }

    // ==================== VALIDATION ====================

    /**
     * Validate loan application request
     */
    private void validateLoanRequest(LoanApplicationRequest request) {
        if (request.getLoanType() == null) {
            throw new IllegalArgumentException("Loan type is mandatory");
        }

        // Validate loan-specific details are present
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

    // ==================== MAPPERS ====================

    /**
     * Map personal loan details from request to entity
     */
    private PersonalLoanDetails mapPersonalLoan(LoanApplicationRequest request) {
        var details = request.getPersonalLoanDetails();
        return PersonalLoanDetails.builder()
                .employmentType(details.getEmploymentType())
                .monthlyIncome(details.getMonthlyIncome())
                .employerName(details.getEmployerName())
                .proofOfIdentity(details.getProofOfIdentity())
                .proofOfIncome(details.getProofOfIncome())
                .proofOfAddress(details.getProofOfAddress())
                .applicationStatus("SUBMITTED")
                .build();
    }

    /**
     * Map education loan details from request to entity
     */
    private EducationLoanDetails mapEducationLoan(LoanApplicationRequest request) {
        var details = request.getEducationLoanDetails();
        return EducationLoanDetails.builder()
                .courseName(details.getCourseName())
                .courseDurationMonths(details.getCourseDurationMonths())
                .coApplicantName(details.getCoApplicantName())
                .coApplicantIncome(details.getCoApplicantIncome())
                .relationship(details.getRelationship())
                .proofOfAdmission(details.getProofOfAdmission())
                .proofOfIncome(details.getProofOfIncome())
                .proofOfAddress(details.getProofOfAddress())
                .collateralDocuments(details.getCollateralDocuments())
                .build();
    }

    /**
     * Map business loan details from request to entity
     */
    private BusinessLoanDetails mapBusinessLoan(LoanApplicationRequest request) {
        var details = request.getBusinessLoanDetails();

        if(details.getBusinessType().equals("personal")){
            throw new RuntimeException("Business loan mapping not implemented yet");
        }

        return BusinessLoanDetails.builder()
                .businessName(details.getBusinessName())
                .businessType(details.getBusinessType())
                .gstAnnualTurnover(details.getGstAnnualTurnover())
                .businessVintageYears(details.getBusinessVintageYears())
                .proofOfBusiness(details.getProofOfBusiness())
                .proofOfIncome(details.getProofOfIncome())
                .calculatedEligibleAmount(null) // Calculated during eligibility check
                .build();
    }

    /**
     * Map vehicle loan details from request to entity
     */
    private VehicleLoanDetails mapVehicleLoan(LoanApplicationRequest request) {
        var details = request.getVehicleLoanDetails();
        return VehicleLoanDetails.builder()
                .vehicleType(details.getVehicleType())
                .vehicleBrand(details.getVehicleBrand())
                .vehicleModel(details.getVehicleModel())
                .downPaymentAmount(details.getDownPaymentAmount())
                .dealerName(details.getDealerName())
                .proofOfIdentity(details.getProofOfIdentity())
                .proofOfIncome(details.getProofOfIncome())
                .insuranceProof(details.getInsuranceProof())
                .downPaymentProof(details.getDownPaymentProof())
                .build();
    }
}