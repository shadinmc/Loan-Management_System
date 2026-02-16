package com.lms.testutil;

import org.slf4j.MDC;

public final class TestCorrelationidUtil {

    private TestCorrelationidUtil() {
    }

    public static void putJobContext(String jobId, String loanId, String correlationId) {
        if (jobId != null) {
            MDC.put("job_id", jobId);
        }
        if (loanId != null) {
            MDC.put("loan_id", loanId);
        }
        if (correlationId != null) {
            MDC.put("correlationId", correlationId);
        }
    }

    public static void clear() {
        MDC.clear();
    }
}