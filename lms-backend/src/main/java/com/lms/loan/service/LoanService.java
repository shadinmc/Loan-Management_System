package com.lms.loan.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.common.idempotency.IdempotencyKeyService;
import com.lms.common.idempotency.IdempotencyRecord;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.dto.*;
import com.lms.loan.entity.Loan;
import com.lms.loan.entity.embedded.*;
import com.lms.loan.repository.LoanRepository;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import com.lms.kyc.service.KycService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
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

    private static final List<LoanStatus> BLOCKING_STATUSES = List.of(
            LoanStatus.DISBURSED,
            LoanStatus.ACTIVE,
            LoanStatus.DISBURSEMENT_PENDING
    );


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
    public LoanApplicationResponse  applyForLoan( LoanApplicationRequest request, String idempotencyKey) {
        String userId = securityUtils.getCurrentUserId();
        // Step 0: Validate KYC
        kycService.validateKycVerified(userId);

        // Step 0.5: Prevent duplicate active/disbursed loans of same type
        boolean alreadyHasLoan =
                loanRepository.existsByUserIdAndLoanTypeAndStatusIn(
                        userId,
                        request.getLoanType(),
                        BLOCKING_STATUSES
                );

        if (alreadyHasLoan) {
            throw new IllegalStateException(
                    "You already have an active or disbursed "
                            + request.getLoanType() + " loan"
            );
        }


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
                    return toResponse(existingLoan.get());
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
                .status(LoanStatus.APPLIED)
                .appliedDate(Instant.now())
                .outstandingPrincipal(BigDecimal.valueOf(request.getLoanAmount()))
                .emiEligible(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
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

        return toResponse(savedLoan);
    }

    private LoanApplicationResponse toResponse(Loan loan) {
        return LoanApplicationResponse.builder()
                .loanId(loan.getLoanId())
                .loanType(loan.getLoanType())
                .status(loan.getStatus())
                .loanAmount(loan.getLoanAmount())
                .tenureMonths(loan.getTenureMonths())
                .appliedDate(
                        loan.getAppliedDate()
                                .atZone(ZoneId.systemDefault())
                                .toLocalDate()
                )
                .emiEligible(loan.getEmiEligible())
                .message("Loan application submitted successfully")
                .build();
    }



    public List<LoanSummaryResponse> getLoanSummaries(String userId) {

        return loanRepository.findByUserId(userId)
                .stream()
                .map(loan -> new LoanSummaryResponse(
                        loan.getLoanId(),
                        loan.getLoanType(),
                        loan.getStatus(),
                        loan.getLoanAmount(),
                        loan.getAppliedDate()
                                .atZone(ZoneId.systemDefault())
                                .toLocalDate()
                ))
                .toList();

    }


    public LoanDetailResponse getLoanDetails(String loanId, String userId) {

        Loan loan = loanRepository.findByLoanIdAndUserId(loanId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Loan not found")
                );

        Object details = switch (loan.getLoanType()) {
            case PERSONAL -> loan.getPersonalLoanDetails();
            case EDUCATION -> loan.getEducationLoanDetails();
            case BUSINESS -> loan.getBusinessLoanDetails();
            case VEHICLE -> loan.getVehicleLoanDetails();
        };

        return LoanDetailResponse.builder()
                .loanId(loan.getLoanId())
                .loanType(loan.getLoanType())
                .status(loan.getStatus())
                .loanAmount(loan.getLoanAmount())
                .tenureMonths(loan.getTenureMonths())
                .emiAmount(loan.getEmiAmount())
                .outstandingPrincipal(loan.getOutstandingPrincipal())
                .appliedDate(loan.getAppliedDate().atZone(ZoneId.systemDefault()).toLocalDate())
                .approvedDate(loan.getApprovedDate() == null ? null : loan.getApprovedDate().atZone(ZoneId.systemDefault()).toLocalDate()
        )
                .loanDetails(details)
                .build();
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
        loan.setUpdatedAt(Instant.now());

        return loanRepository.save(loan);
    }




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
        loan.setUpdatedAt(Instant.now());
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
        var details = request.getPersonalLoanDetails();
        return PersonalLoanDetails.builder()
                .employmentType(details.getEmploymentType())
                .monthlyIncome(details.getMonthlyIncome())
                .employerName(details.getEmployerName())
                .proofOfIdentity(decodeBase64Document(details.getProofOfIdentity()))
                .proofOfIncome(decodeBase64Document(details.getProofOfIncome()))
                .proofOfAddress(decodeBase64Document(details.getProofOfAddress()))
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
                .proofOfAdmission(decodeBase64Document(details.getProofOfAdmission()))
                .proofOfIncome(decodeBase64Document(details.getProofOfIncome()))
                .proofOfAddress(decodeBase64Document(details.getProofOfAddress()))
                .collateralDocuments(decodeBase64Document(details.getCollateralDocuments()))
                .build();
    }

    /**
     * Map business loan details from request to entity
     */
    private BusinessLoanDetails mapBusinessLoan(LoanApplicationRequest request) {
        var details = request.getBusinessLoanDetails();

        if(details.getBusinessType().equals("Personal")){
            throw new RuntimeException("Business loan mapping not implemented yet");
        }

        return BusinessLoanDetails.builder()
                .businessName(details.getBusinessName())
                .businessType(details.getBusinessType())
                .gstAnnualTurnover(details.getGstAnnualTurnover())
                .businessVintageYears(details.getBusinessVintageYears())
                .proofOfBusiness(decodeBase64Document(details.getProofOfBusiness()))
                .proofOfIncome(decodeBase64Document(details.getProofOfIncome()))
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
                .proofOfIdentity(decodeBase64Document(details.getProofOfIdentity()))
                .proofOfIncome(decodeBase64Document(details.getProofOfIncome()))
                .insuranceProof(decodeBase64Document(details.getInsuranceProof()))
                .downPaymentProof(decodeBase64Document(details.getDownPaymentProof()))
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
        e.setProofOfAdmission(decodeBase64Document(dto.getProofOfAdmission()));
        e.setProofOfIncome(decodeBase64Document(dto.getProofOfIncome()));
        e.setProofOfAddress(decodeBase64Document(dto.getProofOfAddress()));
        e.setCollateralDocuments(decodeBase64Document(dto.getCollateralDocuments()));
        return e;
    }

    private PersonalLoanDetails toPersonalEntity(PersonalLoanDetailsDto dto) {
        if (dto == null) return null;

        PersonalLoanDetails e = new PersonalLoanDetails();
        e.setEmploymentType(dto.getEmploymentType());
        e.setMonthlyIncome(dto.getMonthlyIncome());
        e.setEmployerName(dto.getEmployerName());
        e.setProofOfIdentity(decodeBase64Document(dto.getProofOfIdentity()));
        e.setProofOfIncome(decodeBase64Document(dto.getProofOfIncome()));
        e.setProofOfAddress(decodeBase64Document(dto.getProofOfAddress()));
        return e;
    }

    private BusinessLoanDetails toBusinessEntity(BusinessLoanDetailsDto dto) {
        if (dto == null) return null;

        BusinessLoanDetails e = new BusinessLoanDetails();
        e.setBusinessName(dto.getBusinessName());
        e.setBusinessType(dto.getBusinessType());
        e.setGstAnnualTurnover(dto.getGstAnnualTurnover());
        e.setBusinessVintageYears(dto.getBusinessVintageYears());
        e.setProofOfBusiness(decodeBase64Document(dto.getProofOfBusiness()));
        e.setProofOfIncome(decodeBase64Document(dto.getProofOfIncome()));
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
        e.setProofOfIdentity(decodeBase64Document(dto.getProofOfIdentity()));
        e.setProofOfIncome(decodeBase64Document(dto.getProofOfIncome()));
        e.setInsuranceProof(decodeBase64Document(dto.getInsuranceProof()));
        e.setDownPaymentProof(decodeBase64Document(dto.getDownPaymentProof()));
        return e;
    }

    private static final int MAX_DOC_SIZE_BYTES = 1_048_576; // 1 MB

    private Binary decodeBase64Document(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String base64 = value;
        int commaIndex = value.indexOf(',');
        if (commaIndex >= 0) {
            base64 = value.substring(commaIndex + 1);
        }

        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(base64);
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid document encoding");
        }

        if (bytes.length > MAX_DOC_SIZE_BYTES) {
            throw new RuntimeException("Document size exceeds 1MB limit");
        }

        return new Binary(BsonBinarySubType.BINARY, bytes);
    }
}
