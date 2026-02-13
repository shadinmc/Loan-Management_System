package com.lms.repayment.scheduler;

import com.lms.cibil.enums.CibilEventType;
import com.lms.cibil.service.CibilScoreService;
import com.lms.repayment.entity.Emi;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmiOverdueScheduler {

    private static final BigDecimal PENALTY_RATE = new BigDecimal("0.02"); // 2%

    private final RepaymentScheduleRepository repaymentRepo;
    private final CibilScoreService cibilScoreService;

    @Scheduled(cron = "0 0 1 * * *") // daily at 1 AM
    public void applyOverduePenalties() {

        List<RepaymentSchedule> schedules =
                repaymentRepo.findAll();

        Instant now = Instant.now();

        for (RepaymentSchedule schedule : schedules) {

            if (schedule.isClosed()) continue;

            boolean updated = false;

            for (Emi emi : schedule.getEmis()) {

                if (emi.getStatus() == RepaymentStatus.PAID) continue;

                // EMI overdue check
                if (now.isAfter(emi.getDueDate())) {

                    // Mark overdue
                    emi.setStatus(RepaymentStatus.OVERDUE);

                    cibilScoreService.applyEvent(
                            schedule.getUserId(),
                            CibilEventType.EMI_OVERDUE
                    );


                    // Apply penalty only once per month
                    if (emi.getLastPenaltyAppliedAt() == null ||
                            emi.getLastPenaltyAppliedAt()
                                    .plus(30, ChronoUnit.DAYS)
                                    .isBefore(now)) {

                        BigDecimal penalty =
                                emi.getEmiAmount().multiply(PENALTY_RATE);

                        emi.setPenaltyAmount(
                                emi.getPenaltyAmount().add(penalty)
                        );

                        emi.setLastPenaltyAppliedAt(now);

                        // Carry forward penalty
                        schedule.setOutstandingAmount(
                                schedule.getOutstandingAmount().add(penalty)
                        );

                        cibilScoreService.applyEvent(
                                schedule.getUserId(),
                                CibilEventType.PENALTY_APPLIED
                        );


                        updated = true;

                        log.info(
                                "PENALTY APPLIED | loanId={} emi={} penalty={}",
                                schedule.getLoanId(),
                                emi.getEmiNumber(),
                                penalty
                        );
                    }
                }
            }

            if (updated) {
                schedule.setUpdatedAt(now);
                repaymentRepo.save(schedule);
            }
        }
    }
}

