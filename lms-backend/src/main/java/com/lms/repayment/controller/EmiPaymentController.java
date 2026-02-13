package com.lms.repayment.controller;

import com.lms.repayment.dto.EmiPaymentRequest;
import com.lms.repayment.service.EmiPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repayments")
@RequiredArgsConstructor
public class EmiPaymentController {

    private final EmiPaymentService emiPaymentService;

    @PostMapping("/{loanId}/pay")
    public ResponseEntity<Void> payEmi(
            @PathVariable String loanId,
            @RequestBody EmiPaymentRequest request
    ) {
        emiPaymentService.payEmi(loanId, request.getAmount());
        return ResponseEntity.ok().build();
    }
}

