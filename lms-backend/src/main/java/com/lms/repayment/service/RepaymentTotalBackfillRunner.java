package com.lms.repayment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RepaymentTotalBackfillRunner implements CommandLineRunner {

    private final RepaymentTotalBackfillService repaymentTotalBackfillService;

    @Value("${app.repayment.backfillClosedTotalsOnStartup:true}")
    private boolean backfillOnStartup;

    @Override
    public void run(String... args) {
        if (!backfillOnStartup) {
            log.info("BACKFILL CLOSED TOTALS | skipped (backfillClosedTotalsOnStartup=false)");
            return;
        }
        repaymentTotalBackfillService.backfillClosedTotals(false);
    }
}
