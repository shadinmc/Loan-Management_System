package com.lms.repayment.service;

import com.lms.loan.entity.Loan;
import com.lms.repayment.entity.Emi;
import com.lms.repayment.entity.RepaymentSchedule;
import com.lms.repayment.enums.RepaymentStatus;
import com.lms.repayment.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RepaymentScheduleGeneratorService {

    private final RepaymentScheduleRepository repository;

    public void generateForLoan(Loan loan) {

        if (repository.existsByLoanId(loan.getLoanId())) {
            log.info("Repayment schedule already exists | loanId={}", loan.getLoanId());
            return;
        }

        ZoneId zoneId = ZoneId.systemDefault();
        List<Emi> emis = new ArrayList<>();

        LocalDate firstDueDate =
                loan.getActivatedAt()
                        .atZone(zoneId)
                        .toLocalDate()
                        .plusMonths(1);

        for (int i = 1; i <= loan.getTenureMonths(); i++) {

            LocalDate dueDate = firstDueDate.plusMonths(i - 1);

            emis.add(
                    Emi.builder()
                            .emiNumber(i)
                            .dueDate(dueDate.atStartOfDay(zoneId).toInstant())
                            .emiAmount(loan.getEmiAmount())
                            .paidAmount(BigDecimal.ZERO)
                            .penaltyAmount(BigDecimal.ZERO)
                            .status(RepaymentStatus.PENDING)
                            .build()
            );
        }

        BigDecimal totalPayable =
                loan.getEmiAmount()
                        .multiply(BigDecimal.valueOf(loan.getTenureMonths()));

        RepaymentSchedule schedule = RepaymentSchedule.builder()
                .loanId(loan.getLoanId())
                .userId(loan.getUserId())
                .emis(emis)
                .totalPayableAmount(totalPayable)
                .totalPaidAmount(BigDecimal.ZERO)
                .outstandingAmount(totalPayable)
                .nextEmiDate(emis.get(0).getDueDate())
                .nextEmiAmount(loan.getEmiAmount())
                .closed(false)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        repository.save(schedule);

        log.info("EMI SCHEDULE GENERATED | loanId={} emis={}", loan.getLoanId(), emis.size());
    }

}

