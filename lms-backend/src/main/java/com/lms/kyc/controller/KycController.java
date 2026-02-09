package com.lms.kyc.controller;

import com.lms.kyc.dto.KycRequest;
import com.lms.kyc.dto.KycResponse;
import com.lms.kyc.service.KycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kyc")
@RequiredArgsConstructor
public class KycController {

    private final KycService kycService;

    @PostMapping
    public ResponseEntity<KycResponse> submitKyc(
            @RequestHeader("X-Idempotency-Key") String idempotencyKey,
            @RequestBody @Valid KycRequest request
    ) {
        return ResponseEntity.ok(
                kycService.submitKyc(idempotencyKey, request)
        );
    }
}

