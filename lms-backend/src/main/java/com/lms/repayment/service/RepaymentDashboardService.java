package com.lms.repayment.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.dto.EmiViewResponse;
import com.lms.repayment.dto.ManagerEmiViewResponse;
import com.lms.repayment.dto.ManagerRepaymentDetailResponse;
import com.lms.repayment.dto.ManagerRepaymentPageResponse;
import com.lms.repayment.dto.ManagerRepaymentSummaryResponse;
import com.lms.repayment.dto.RepaymentDashboardResponse;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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

    public ManagerRepaymentPageResponse getManagerRepaymentSummaries(int page, int size) {
        List<ManagerRepaymentSummaryResponse> sorted = repository.findAll()
                .stream()
                .sorted(Comparator.comparing(RepaymentSchedule::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(schedule -> {
                    LoanStatus loanStatus = deriveLoanStatus(schedule.getLoanId());
                    if (loanStatus != LoanStatus.ACTIVE && loanStatus != LoanStatus.CLOSED) {
                        return null;
                    }
                    return toSummary(schedule, loanStatus);
                })
                .filter(item -> item != null)
                .toList();

        return toPage(sorted, page, size);
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

    private ManagerRepaymentPageResponse toPage(
            List<ManagerRepaymentSummaryResponse> items,
            int page,
            int size
    ) {
        int safeSize = Math.max(size, 1);
        int safePage = Math.max(page, 0);
        int fromIndex = Math.min(safePage * safeSize, items.size());
        int toIndex = Math.min(fromIndex + safeSize, items.size());
        List<ManagerRepaymentSummaryResponse> content = items.subList(fromIndex, toIndex);
        int totalPages = (int) Math.ceil(items.size() / (double) safeSize);

        return new ManagerRepaymentPageResponse(
                content,
                safePage,
                safeSize,
                items.size(),
                totalPages,
                safePage == 0,
                totalPages == 0 || safePage >= totalPages - 1
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
