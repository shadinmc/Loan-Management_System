package com.lms.loan.dto;

import com.lms.common.enums.LoanType;
import lombok.Data;

@Data
public class LoanApplicationRequest {

    // -------- Common loan fields --------
    private LoanType loanType;
    private Double loanAmount;
    private Integer tenureMonths;
    private Double interestRate;

    // -------- Loan-type specific DTOs --------
    private PersonalLoanDetailsDto personalLoanDetails;
    private EducationLoanDetailsDto educationLoanDetails;
    private BusinessLoanDetailsDto businessLoanDetails;
    private VehicleLoanDetailsDto vehicleLoanDetails;
}
