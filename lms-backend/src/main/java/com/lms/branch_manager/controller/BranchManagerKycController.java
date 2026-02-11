package com.lms.branch_manager.controller;

import com.lms.branch_manager.dto.KycDecisionResponse;
import com.lms.branch_manager.dto.KycReviewRequest;
import com.lms.branch_manager.dto.PendingKycResponse;
import com.lms.branch_manager.service.BranchManagerKycQueryService;
import com.lms.kyc.entity.Kyc;
import com.lms.kyc.enums.KycStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/branch/kyc")
@RequiredArgsConstructor
public class BranchManagerKycController {

    private final BranchManagerKycQueryService queryService;

    @GetMapping("/pending")
    public ResponseEntity<List<PendingKycResponse>> getPendingKycs() {
        return ResponseEntity.ok(queryService.getPendingKycs());
    }


    @PostMapping("/{userId}/decision")
    public ResponseEntity<KycDecisionResponse> decideKyc(
            @PathVariable String userId,
            @RequestBody KycReviewRequest request) {

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

