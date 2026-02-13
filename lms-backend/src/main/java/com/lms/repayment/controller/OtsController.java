package com.lms.repayment.controller;

import com.lms.repayment.dto.OtsPaymentRequest;
import com.lms.repayment.dto.OtsQuoteResponse;
import com.lms.repayment.service.OtsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repayments/{loanId}/ots")
@RequiredArgsConstructor
public class OtsController {

    private final OtsService otsService;

    @GetMapping("/quote")
    public ResponseEntity<OtsQuoteResponse> getQuote(
            @PathVariable String loanId
    ) {
        return ResponseEntity.ok(otsService.getQuote(loanId));
    }

    @PostMapping("/settle")
    public ResponseEntity<Void> settle(
            @PathVariable String loanId,
            @RequestBody OtsPaymentRequest request
    ) {
        otsService.settle(loanId, request.getAmount());
        return ResponseEntity.ok().build();
    }
}

