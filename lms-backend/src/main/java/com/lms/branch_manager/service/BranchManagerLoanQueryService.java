package com.lms.branch_manager.service;

import com.lms.branch_manager.dto.BranchLoanReviewDto;
import com.lms.common.enums.LoanStatus;
import com.lms.common.exception.LoanDataIntegrityException;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.repository.KycRepository;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.user.entity.User;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.lms.branch_manager.dto.BranchLoanPageResponse;

import java.time.ZoneId;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchManagerLoanQueryService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final KycRepository kycRepository;

    public BranchLoanPageResponse getLoans(
            LoanStatus status,
            Boolean emiEligible,
            int page,
            int size
    ) {

        List<Loan> loans = List.of();

        if (status != null && emiEligible != null) {
            loans = loanRepository.findByStatusAndEmiEligible(status, emiEligible);
        } else if (status != null) {
            loans = loanRepository.findByStatus(status);
        } else if (emiEligible != null) {
            loans = loanRepository.findByEmiEligible(emiEligible);
        } else {
            loans = loanRepository.findAll();
        }

        List<BranchLoanReviewDto> sorted = loans.stream()
                .map(this::mapToDto)
                .sorted(Comparator
                        .comparingInt((BranchLoanReviewDto dto) -> statusOrder(dto.status()))
                        .thenComparing(
                                (BranchLoanReviewDto dto) ->
                                        dto.appliedDate() == null
                                                ? Instant.EPOCH
                                                : dto.appliedDate()
                                                .atStartOfDay(ZoneId.systemDefault())
                                                .toInstant(),
                                Comparator.reverseOrder()
                        ))
                .toList();

        int safeSize = Math.max(size, 1);
        int safePage = Math.max(page, 0);
        int fromIndex = Math.min(safePage * safeSize, sorted.size());
        int toIndex = Math.min(fromIndex + safeSize, sorted.size());
        List<BranchLoanReviewDto> content = sorted.subList(fromIndex, toIndex);
        int totalPages = (int) Math.ceil(sorted.size() / (double) safeSize);

        return new BranchLoanPageResponse(
                content,
                safePage,
                safeSize,
                sorted.size(),
                totalPages,
                safePage == 0,
                totalPages == 0 || safePage >= totalPages - 1
        );
    }

    private int statusOrder(String status) {
        if ("APPLIED".equals(status)) return 0;
        if ("UNDER_BRANCH_REVIEW".equals(status)) return 1;
        if ("CLARIFICATION_REQUIRED".equals(status)) return 2;
        if ("NOT_ELIGIBLE".equals(status)) return 3;
        if ("BRANCH_APPROVED".equals(status)) return 4;
        if ("BRANCH_REJECTED".equals(status)) return 5;
        return 9;
    }

    private BranchLoanReviewDto mapToDto(Loan loan) {

        User user = userRepository.findById(loan.getUserId())
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "User not found for loanId: " + loan.getLoanId()
                        )
                );

        Kyc kyc = kycRepository.findByUserIdWithoutDocuments(user.getId())
                .orElseThrow(() ->
                        new LoanDataIntegrityException(
                                "KYC not found for userId: " + user.getId()
                        )
                );



        return new BranchLoanReviewDto(
                loan.getLoanId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                "XXXX" + kyc.getPanNumber().substring(4),
                "XXXX-XXXX-" + kyc.getAadhaarNumber().substring(8),
                loan.getLoanType().name(),
                loan.getLoanAmount(),
                loan.getStatus().name(),
                loan.getEmiEligible(),
                loan.getEmiAmount(),
                loan.getAppliedDate()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
        );
    }
}
