package com.lms.common.exception;

public class DuplicateLoanTypeException extends RuntimeException {

    public DuplicateLoanTypeException(String message) {
        super(message);
    }
}
