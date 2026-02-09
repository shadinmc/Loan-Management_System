package com.lms.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class KycNotVerifiedException extends RuntimeException {

    public KycNotVerifiedException() {
        super("KYC not verified. Please complete KYC to apply for a loan.");
    }
}
