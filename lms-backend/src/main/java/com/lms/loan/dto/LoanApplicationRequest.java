package com.lms.loan.dto;

import com.lms.common.enums.LoanType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoanApplicationRequest {

    private ApplicantDetailsDto applicantDetails;

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
