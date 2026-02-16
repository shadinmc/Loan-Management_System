package com.lms.repayment.policy;

import com.lms.loan.entity.Loan;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class OtsPolicyResolver {

    public OtsPolicy resolve(Loan loan) {
        return switch (loan.getLoanType()) {
            case PERSONAL ->
                    new OtsPolicy(
                            new BigDecimal("0.85"),
                            new BigDecimal("0.70"),
                            new BigDecimal("1.05")
                    );
            case EDUCATION ->
                    new OtsPolicy(
                            new BigDecimal("0.90"),
                            new BigDecimal("0.60"),
                            new BigDecimal("1.02")
                    );
            case BUSINESS ->
                    new OtsPolicy(
                            new BigDecimal("0.80"),
                            new BigDecimal("0.75"),
                            new BigDecimal("1.08")
                    );
            case VEHICLE ->
                    new OtsPolicy(
                            new BigDecimal("0.88"),
                            new BigDecimal("0.65"),
                            new BigDecimal("1.04")
                    );
        };
    }
}
