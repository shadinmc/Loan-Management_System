package com.lms.repayment.service;

import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import com.lms.wallet.entity.WalletTransaction;
import com.lms.wallet.enums.PaymentAction;
import com.lms.wallet.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RepaymentTotalBackfillService {

    private static final String OTS_PREFIX = "OTS:";
    private static final String EMI_PREFIX = "EMI:";

    private final RepaymentScheduleRepository repaymentScheduleRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    public Map<String, Object> backfillClosedTotals(boolean dryRun) {
        List<RepaymentSchedule> schedules = repaymentScheduleRepository.findByClosedTrue();

        int scanned = 0;
        int updated = 0;
        int skipped = 0;
        int otsDetected = 0;

        for (RepaymentSchedule schedule : schedules) {
            scanned++;

            BigDecimal totalPayable = nvl(schedule.getTotalPayableAmount());
            BigDecimal currentPaid = nvl(schedule.getTotalPaidAmount());

            if (totalPayable.compareTo(BigDecimal.ZERO) <= 0) {
                skipped++;
                continue;
            }

            if (currentPaid.compareTo(totalPayable) >= 0) {
                skipped++;
                continue;
            }

            List<WalletTransaction> txs =
                    walletTransactionRepository.findByLoanIdAndActionOrderByDoneAtDesc(
                            schedule.getLoanId(),
                            PaymentAction.WITHDRAWN
                    );

            boolean hasOts = txs.stream()
                    .anyMatch(tx -> isOtsReference(tx.getReferenceId(), schedule.getLoanId()));

            BigDecimal newPaid;
            if (hasOts) {
                otsDetected++;
                newPaid = txs.stream()
                        .filter(tx -> isEmiReference(tx.getReferenceId(), schedule.getLoanId())
                                || isOtsReference(tx.getReferenceId(), schedule.getLoanId()))
                        .map(tx -> nvl(tx.getAmount()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            } else {
                newPaid = totalPayable;
            }

            if (newPaid.compareTo(BigDecimal.ZERO) <= 0) {
                skipped++;
                continue;
            }

            if (newPaid.compareTo(currentPaid) != 0) {
                if (!dryRun) {
                    schedule.setTotalPaidAmount(newPaid);
                    schedule.setOutstandingAmount(BigDecimal.ZERO);
                    schedule.setUpdatedAt(Instant.now());
                    repaymentScheduleRepository.save(schedule);
                }
                updated++;
            } else {
                skipped++;
            }
        }

        log.info(
                "BACKFILL CLOSED TOTALS | scanned={} updated={} skipped={} otsDetected={} dryRun={}",
                scanned,
                updated,
                skipped,
                otsDetected,
                dryRun
        );

        return Map.of(
                "scanned", scanned,
                "updated", updated,
                "skipped", skipped,
                "otsDetected", otsDetected,
                "dryRun", dryRun
        );
    }

    private static BigDecimal nvl(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private static boolean isOtsReference(String referenceId, String loanId) {
        if (referenceId == null || loanId == null) return false;
        return referenceId.startsWith(OTS_PREFIX + loanId);
    }

    private static boolean isEmiReference(String referenceId, String loanId) {
        if (referenceId == null || loanId == null) return false;
        return referenceId.startsWith(EMI_PREFIX + loanId + ":");
    }
}
