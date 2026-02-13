package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.repayment.dto.EmiViewResponse;
import com.lms.repayment.dto.RepaymentDashboardResponse;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepaymentDashboardService {

    private final RepaymentScheduleRepository repository;
    private final SecurityUtils securityUtils;

    public RepaymentDashboardResponse getMyLoanRepayment(String loanId) {

        String userId = securityUtils.getCurrentUserId();

        RepaymentSchedule schedule = repository.findByLoanId(loanId)
                .orElseThrow(() ->
                        new RuntimeException("Repayment schedule not found"));

        // 🔐 Ownership check
        if (!schedule.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        List<EmiViewResponse> emis =
                schedule.getEmis().stream()
                        .map(e -> new EmiViewResponse(
                                e.getEmiNumber(),
                                e.getDueDate(),
                                e.getEmiAmount(),
                                e.getPaidAmount(),
                                e.getPenaltyAmount(),
                                e.getStatus()
                        ))
                        .toList();

        return new RepaymentDashboardResponse(
                schedule.getLoanId(),
                schedule.getTotalPayableAmount(),
                schedule.getTotalPaidAmount(),
                schedule.getOutstandingAmount(),
                schedule.getNextEmiDate(),
                schedule.getNextEmiAmount(),
                schedule.isClosed(),
                emis
        );
    }
}

