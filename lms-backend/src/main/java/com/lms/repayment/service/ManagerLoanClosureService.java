package com.lms.repayment.service;

import com.lms.audit.service.AuditService;
import com.lms.auth.security.SecurityUtils;
import com.lms.cibil.enums.CibilEventType;
import com.lms.cibil.service.CibilScoreService;
import com.lms.common.enums.LoanStatus;
import com.lms.loan.entity.Loan;
import com.lms.loan.repository.LoanRepository;
import com.lms.repayment.dto.ManagerLoanClosurePageResponse;
import com.lms.repayment.dto.ManagerLoanClosureResponse;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ManagerLoanClosureService {

    private final LoanRepository loanRepository;
    private final RepaymentScheduleRepository repaymentScheduleRepository;
    private final UserRepository userRepository;
    private final CibilScoreService cibilScoreService;
    private final SecurityUtils securityUtils;
    private final AuditService auditService;

    public ManagerLoanClosurePageResponse getLoanClosureRecords(int page, int size) {
        List<ManagerLoanClosureResponse> sorted = repaymentScheduleRepository.findAll().stream()
                .map(schedule -> {
                    Loan loan = loanRepository.findByLoanId(schedule.getLoanId()).orElse(null);
                    if (loan == null) {
                        return null;
                    }
                    if (loan.getStatus() != LoanStatus.ACTIVE && loan.getStatus() != LoanStatus.CLOSED) {
                        return null;
                    }
                    return mapToResponse(schedule, loan);
                })
                .filter(record -> record != null)
                .sorted(Comparator
                        .comparingInt((ManagerLoanClosureResponse record) -> statusOrder(record.getStatus()))
                        .thenComparing(ManagerLoanClosureResponse::getClosedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(ManagerLoanClosureResponse::getLoanId, Comparator.reverseOrder()))
                .toList();

        return toPage(sorted, page, size);
    }

    @Transactional
    public ManagerLoanClosureResponse closeLoan(String loanId) {
        String actorUserId = securityUtils.getCurrentUserId();
        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        RepaymentSchedule schedule = repaymentScheduleRepository.findByLoanId(loanId)
                .orElseThrow(() -> new RuntimeException("Repayment schedule not found"));

        if (!isClosureEligible(schedule)) {
            throw new IllegalStateException("Loan is not eligible for closure");
        }

        if (loan.getStatus() != LoanStatus.CLOSED) {
            loan.setStatus(LoanStatus.CLOSED);
            loan.setClosedAt(Instant.now());
            loan.setUpdatedAt(Instant.now());
            loanRepository.save(loan);
            cibilScoreService.applyEvent(loan.getUserId(), CibilEventType.LOAN_CLOSED);
        }

        schedule.setClosed(true);
        schedule.setNextEmiDate(null);
        schedule.setNextEmiAmount(BigDecimal.ZERO);
        BigDecimal outstandingToSettle = schedule.getOutstandingAmount();
        if (outstandingToSettle == null || outstandingToSettle.compareTo(BigDecimal.ZERO) < 0) {
            outstandingToSettle = BigDecimal.ZERO;
        }
        BigDecimal currentTotalPaid = schedule.getTotalPaidAmount() == null
                ? BigDecimal.ZERO
                : schedule.getTotalPaidAmount();
        BigDecimal totalPayable = schedule.getTotalPayableAmount() == null
                ? BigDecimal.ZERO
                : schedule.getTotalPayableAmount();
        BigDecimal remainingToSettle = outstandingToSettle;
        if (remainingToSettle.compareTo(BigDecimal.ZERO) == 0 && totalPayable.compareTo(BigDecimal.ZERO) > 0) {
            remainingToSettle = totalPayable.subtract(currentTotalPaid).max(BigDecimal.ZERO);
        }
        schedule.setTotalPaidAmount(currentTotalPaid.add(remainingToSettle));
        schedule.setOutstandingAmount(BigDecimal.ZERO);
        if (schedule.getEmis() != null) {
            schedule.getEmis().forEach(emi -> {
                if (emi.getStatus() != RepaymentStatus.PAID) {
                    emi.setStatus(RepaymentStatus.PAID);
                    if (emi.getPaidAmount() == null || emi.getPaidAmount().compareTo(BigDecimal.ZERO) <= 0) {
                        emi.setPaidAmount(emi.getEmiAmount());
                    }
                    emi.setPenaltyAmount(BigDecimal.ZERO);
                    emi.setPaidAt(Instant.now());
                }
            });
        }
        schedule.setUpdatedAt(Instant.now());
        repaymentScheduleRepository.save(schedule);

        try {
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("loanId", loanId);
            requestPayload.put("outstandingAmount", schedule.getOutstandingAmount());

            Map<String, Object> responsePayload = Map.of(
                    "currentStatus", loan.getStatus(),
                    "closedAt", loan.getClosedAt()
            );

            auditService.log(
                    actorUserId,
                    "LOAN_CLOSURE",
                    "LOAN",
                    loanId,
                    requestPayload,
                    responsePayload,
                    200,
                    true
            );
        } catch (Exception e) {
            log.error("AUDIT FAILED — request still successful", e);
        }

        return mapToResponse(schedule, loan);
    }

    private ManagerLoanClosureResponse mapToResponse(RepaymentSchedule schedule, Loan loan) {
        int totalEmis = schedule.getEmis() == null ? 0 : schedule.getEmis().size();
        int paidEmis = schedule.getEmis() == null ? 0 : (int) schedule.getEmis().stream()
                .filter(emi -> emi.getStatus() == RepaymentStatus.PAID)
                .count();
        int remainingMonths = Math.max(totalEmis - paidEmis, 0);

        return new ManagerLoanClosureResponse(
                loan.getLoanId(),
                loan.getUserId(),
                userRepository.findById(loan.getUserId()).map(u -> u.getFullName()).orElse(loan.getUserId()),
                loan.getApprovedAmount() != null ? loan.getApprovedAmount() : loan.getLoanAmount(),
                schedule.getTotalPaidAmount(),
                paidEmis,
                totalEmis,
                remainingMonths,
                isClosureEligible(schedule),
                loan.getStatus(),
                loan.getClosedAt()
        );
    }

    private ManagerLoanClosurePageResponse toPage(
            List<ManagerLoanClosureResponse> items,
            int page,
            int size
    ) {
        int safeSize = Math.max(size, 1);
        int safePage = Math.max(page, 0);
        int fromIndex = Math.min(safePage * safeSize, items.size());
        int toIndex = Math.min(fromIndex + safeSize, items.size());
        List<ManagerLoanClosureResponse> content = items.subList(fromIndex, toIndex);
        int totalPages = (int) Math.ceil(items.size() / (double) safeSize);

        return new ManagerLoanClosurePageResponse(
                content,
                safePage,
                safeSize,
                items.size(),
                totalPages,
                safePage == 0,
                totalPages == 0 || safePage >= totalPages - 1
        );
    }

    private int statusOrder(LoanStatus status) {
        if (status == LoanStatus.ACTIVE) {
            return 0;
        }
        if (status == LoanStatus.CLOSED) {
            return 1;
        }
        return 9;
    }

    private boolean isClosureEligible(RepaymentSchedule schedule) {
        if (schedule.isClosed()) return true;
        BigDecimal outstanding = schedule.getOutstandingAmount() == null ? BigDecimal.ZERO : schedule.getOutstandingAmount();
        return outstanding.compareTo(BigDecimal.ZERO) <= 0;
    }
}
