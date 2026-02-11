package com.lms.repayment.controller;

import com.lms.repayment.entity.Repayment;
import com.lms.repayment.service.RepaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/repayments")
@RequiredArgsConstructor
public class RepaymentController {

    private final RepaymentService repaymentService;

    @PostMapping("/pay/{loanId}")
    public Repayment payEmi(
            @PathVariable String loanId,
            @RequestParam BigDecimal amount
    ) {
        return repaymentService.payEmi(loanId, amount);
    }

    @GetMapping("/{loanId}")
    public List<Repayment> getRepayments(@PathVariable String loanId) {
        return repaymentService.getLoanRepayments(loanId);
    }
}
