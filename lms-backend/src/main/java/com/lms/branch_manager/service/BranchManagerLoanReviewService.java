package com.lms.branch_manager.service;


import com.lms.branch_manager.dto.BranchApplicantDto;
import com.lms.branch_manager.dto.BranchLoanDocumentDto;
import com.lms.branch_manager.dto.BranchLoanReviewDetailsDto;
import com.lms.branch_manager.dto.BranchLoanReviewDto;
import com.lms.common.exception.LoanDataIntegrityException;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.repository.KycRepository;
import com.lms.loan.entity.Loan;
import com.lms.loan.entity.embedded.BusinessLoanDetails;
import com.lms.loan.entity.embedded.EducationLoanDetails;
import com.lms.loan.entity.embedded.PersonalLoanDetails;
import com.lms.loan.entity.embedded.VehicleLoanDetails;
import com.lms.loan.repository.LoanRepository;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.Binary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchManagerLoanReviewService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final KycRepository kycRepository;

    public BranchLoanReviewDetailsDto getReviewData(String loanId) {

        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "Loan not found for loanId: " + loanId
                        )
                );

        User user = userRepository.findById(loan.getUserId())
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "User not found for loanId: " + loan.getLoanId()
                        )
                );

        Kyc kyc = kycRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "KYC not found for userId: " + user.getId()
                        )
                );

        BranchApplicantDto applicant = new BranchApplicantDto(
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                "XXXX" + kyc.getPanNumber().substring(4),
                "XXXX-XXXX-" + kyc.getAadhaarNumber().substring(8)
        );

        List<BranchLoanDocumentDto> documents = extractDocuments(loan);

        return new BranchLoanReviewDetailsDto(
                loan.getLoanId(),
                loan.getLoanType().name(),
                loan.getStatus().name(),
                loan.getLoanAmount(),
                loan.getTenureMonths(),
                loan.getInterestRate(),
                loan.getEmiAmount(),
                loan.getEmiEligible(),
                loan.getDecisionMessage(),
                loan.getAppliedDate(),
                applicant,
                documents
        );
    }

    private List<BranchLoanDocumentDto> extractDocuments(Loan loan) {
        List<BranchLoanDocumentDto> documents = new ArrayList<>();

        switch (loan.getLoanType()) {
            case PERSONAL -> {
                PersonalLoanDetails d = loan.getPersonalLoanDetails();
                if (d != null) {
                    addDoc(documents, "proofOfIdentity", d.getProofOfIdentity());
                    addDoc(documents, "proofOfIncome", d.getProofOfIncome());
                    addDoc(documents, "proofOfAddress", d.getProofOfAddress());
                }
            }
            case VEHICLE -> {
                VehicleLoanDetails d = loan.getVehicleLoanDetails();
                if (d != null) {
                    addDoc(documents, "proofOfIdentity", d.getProofOfIdentity());
                    addDoc(documents, "proofOfIncome", d.getProofOfIncome());
                    addDoc(documents, "insuranceProof", d.getInsuranceProof());
                    addDoc(documents, "downPaymentProof", d.getDownPaymentProof());
                }
            }
            case EDUCATION -> {
                EducationLoanDetails d = loan.getEducationLoanDetails();
                if (d != null) {
                    addDoc(documents, "proofOfAdmission", d.getProofOfAdmission());
                    addDoc(documents, "proofOfIncome", d.getProofOfIncome());
                    addDoc(documents, "proofOfAddress", d.getProofOfAddress());
                    addDoc(documents, "collateralDocuments", d.getCollateralDocuments());
                }
            }
            case BUSINESS -> {
                BusinessLoanDetails d = loan.getBusinessLoanDetails();
                if (d != null) {
                    addDoc(documents, "proofOfBusiness", d.getProofOfBusiness());
                    addDoc(documents, "proofOfIncome", d.getProofOfIncome());
                }
            }
        }

        return documents;
    }

    private void addDoc(List<BranchLoanDocumentDto> documents, String name, Binary value) {
        if (value == null || value.getData() == null || value.getData().length == 0) {
            return;
        }

        String base64 = Base64.getEncoder().encodeToString(value.getData());
        documents.add(new BranchLoanDocumentDto(name, base64));
    }
}

