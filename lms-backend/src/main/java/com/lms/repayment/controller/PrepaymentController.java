package com.lms.repayment.controller;

import com.lms.repayment.dto.PrepaymentRequest;
import com.lms.repayment.service.PrepaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repayments")
@RequiredArgsConstructor
public class PrepaymentController {

    private final PrepaymentService prepaymentService;

    @PostMapping("/{loanId}/prepay")
    public ResponseEntity<Void> prepay(
            @PathVariable String loanId,
            @RequestBody PrepaymentRequest request
    ) {
        prepaymentService.prepay(loanId, request.getAmount());
        return ResponseEntity.ok().build();
    }
}

