package com.lms.branch_manager.controller;

import com.lms.branch_manager.dto.KycDecisionResponse;
import com.lms.branch_manager.dto.KycReviewRequest;
import com.lms.branch_manager.dto.ManagerKycRecordResponse;
import com.lms.branch_manager.service.BranchManagerKycQueryService;
import com.lms.kyc.enums.KycStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/manager/kyc")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('BRANCH_MANAGER','REGIONAL_MANAGER')")
public class ManagerKycController {

    private final BranchManagerKycQueryService queryService;

    @GetMapping
    public ResponseEntity<List<ManagerKycRecordResponse>> getKycRecords() {
        return ResponseEntity.ok(queryService.getAllKycRecords());
    }

    @PostMapping("/{userId}/decision")
    @PreAuthorize("hasRole('BRANCH_MANAGER')")
    public ResponseEntity<KycDecisionResponse> decideKyc(
            @PathVariable String userId,
            @RequestBody KycReviewRequest request
    ) {
        KycStatus status = queryService.reviewKyc(
                userId,
                request.approved(),
                request.rejectionReason()
        );

        return ResponseEntity.ok(
                new KycDecisionResponse(
                        userId,
                        status,
                        status == KycStatus.VERIFIED
                                ? "KYC approved successfully"
                                : "KYC rejected successfully",
                        LocalDateTime.now()
                )
        );
    }
}
