package com.lms.repayment.policy;

import java.math.BigDecimal;

public record OtsPolicy(
        BigDecimal principalFactor,
        BigDecimal interestFactor,
        BigDecimal minRecoveryFactor
) {}
