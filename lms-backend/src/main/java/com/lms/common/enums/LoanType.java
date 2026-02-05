package com.lms.common.enums;

public enum LoanType {
    PERSONAL("Personal Loan", "Unsecured loan for personal expenses"),
    BUSINESS("Business Loan", "Loan for business purposes"),
    VEHICLE("Vehicle Loan", "Loan for purchasing vehicles"),
    EDUCATION("Education Loan", "Loan for educational expenses");

    private final String displayName;
    private final String description;

    LoanType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
