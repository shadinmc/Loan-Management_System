package com.lms.loan.service;

import com.lms.common.enums.LoanType;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class InterestRateService {

    public BigDecimal getRate(LoanType loanType) {

        return switch (loanType) {
            case PERSONAL -> new BigDecimal("11.5");
            case EDUCATION -> new BigDecimal("8.5");
            case BUSINESS -> new BigDecimal("13.0");
            case VEHICLE -> new BigDecimal("9.5");
        };
    }
}