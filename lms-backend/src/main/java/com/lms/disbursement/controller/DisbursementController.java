package com.lms.disbursement.controller;

import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/disbursements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('REGIONAL_MANAGER')")
public class DisbursementController {

    private final LoanRepository loanRepository;

    @GetMapping
    public List<Loan> getDisbursementQueue() {
        return loanRepository.findByStatusIn(
                List.of(
                        LoanStatus.DISBURSEMENT_PENDING,
                        LoanStatus.DISBURSED
                )
        );
    }
}
