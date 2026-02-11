package com.lms.common.util;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public class EmiCalculator {

    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    public static BigDecimal calculateEmi(
            BigDecimal principal,
            BigDecimal annualInterestRate,
            int tenureMonths
    ) {
        if (principal == null || annualInterestRate == null || tenureMonths <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal monthlyRate =
                annualInterestRate.divide(BigDecimal.valueOf(12 * 100), MC);

        BigDecimal onePlusRPowerN =
                monthlyRate.add(BigDecimal.ONE).pow(tenureMonths, MC);

        BigDecimal numerator =
                principal.multiply(monthlyRate, MC).multiply(onePlusRPowerN, MC);

        BigDecimal denominator =
                onePlusRPowerN.subtract(BigDecimal.ONE, MC);

        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }
}
