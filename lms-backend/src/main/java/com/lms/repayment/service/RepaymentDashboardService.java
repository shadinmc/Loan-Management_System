package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.dto.EmiViewResponse;
import com.lms.repayment.dto.ManagerEmiViewResponse;
import com.lms.repayment.dto.ManagerRepaymentDetailResponse;
import com.lms.repayment.dto.ManagerRepaymentSummaryResponse;
import com.lms.repayment.dto.RepaymentDashboardResponse;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepaymentDashboardService {

    private final RepaymentScheduleRepository repository;
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

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

    public List<ManagerRepaymentSummaryResponse> getManagerRepaymentSummaries() {
        return repository.findAll()
                .stream()
                .map(schedule -> {
                    LoanStatus loanStatus = deriveLoanStatus(schedule.getLoanId());
                    if (loanStatus != LoanStatus.ACTIVE && loanStatus != LoanStatus.CLOSED) {
                        return null;
                    }
                    return toSummary(schedule, loanStatus);
                })
                .filter(item -> item != null)
                .toList();
    }

    public ManagerRepaymentDetailResponse getLoanRepaymentForManager(String loanId) {
        RepaymentSchedule schedule = repository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Repayment schedule not found"));

        int totalEmis = schedule.getEmis() == null ? 0 : schedule.getEmis().size();
        int paidEmis = schedule.getEmis() == null ? 0 :
                (int) schedule.getEmis().stream()
                        .filter(emi -> emi.getStatus() == RepaymentStatus.PAID)
                        .count();
        int remainingMonths = Math.max(totalEmis - paidEmis, 0);
        int paidProgressPercent = totalEmis == 0 ? 0 : (paidEmis * 100) / totalEmis;
        LoanStatus loanStatus = deriveLoanStatus(schedule.getLoanId());

        List<ManagerEmiViewResponse> emis = schedule.getEmis() == null ? List.of() :
                schedule.getEmis().stream()
                        .map(e -> new ManagerEmiViewResponse(
                                e.getEmiNumber(),
                                e.getDueDate(),
                                e.getEmiAmount(),
                                e.getPaidAmount(),
                                e.getPenaltyAmount(),
                                e.getStatus(),
                                e.getPaidAt()
                        ))
                        .toList();

        return new ManagerRepaymentDetailResponse(
                schedule.getLoanId(),
                schedule.getUserId(),
                resolveFullName(schedule.getUserId()),
                schedule.getTotalPayableAmount(),
                schedule.getTotalPaidAmount(),
                schedule.getOutstandingAmount(),
                paidEmis,
                totalEmis,
                remainingMonths,
                paidProgressPercent,
                schedule.getNextEmiDate(),
                schedule.getNextEmiAmount(),
                loanStatus,
                emis
        );
    }

    private ManagerRepaymentSummaryResponse toSummary(
            RepaymentSchedule schedule,
            LoanStatus loanStatus
    ) {
        int totalEmis = schedule.getEmis() == null ? 0 : schedule.getEmis().size();
        int paidEmis = schedule.getEmis() == null ? 0 :
                (int) schedule.getEmis().stream()
                        .filter(emi -> emi.getStatus() == RepaymentStatus.PAID)
                        .count();
        int remainingMonths = Math.max(totalEmis - paidEmis, 0);
        int paidProgressPercent = totalEmis == 0 ? 0 : (paidEmis * 100) / totalEmis;

        return new ManagerRepaymentSummaryResponse(
                schedule.getLoanId(),
                schedule.getUserId(),
                resolveFullName(schedule.getUserId()),
                schedule.getTotalPaidAmount(),
                schedule.getOutstandingAmount(),
                paidEmis,
                totalEmis,
                remainingMonths,
                paidProgressPercent,
                schedule.getNextEmiDate(),
                schedule.getNextEmiAmount(),
                loanStatus
        );
    }

    private LoanStatus deriveLoanStatus(String loanId) {
        return loanRepository.findByLoanId(loanId)
                .map(loan -> loan.getStatus())
                .orElse(LoanStatus.ACTIVE);
    }

    private String resolveFullName(String userId) {
        return userRepository.findById(userId)
                .map(user -> user.getFullName() == null || user.getFullName().isBlank()
                        ? userId
                        : user.getFullName())
                .orElse(userId);
    }
}

