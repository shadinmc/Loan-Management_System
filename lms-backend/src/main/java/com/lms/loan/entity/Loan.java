package com.lms.loan.entity;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import com.lms.loan.entity.embedded.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import com.lms.loan.entity.embedded.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "loans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Loan {

    @Id
    private String id; // MongoDB internal _id (DO NOT expose)

    @Indexed(unique = true)
    private String loanId; // Business Loan ID (LN-xxxx)

    private String userId;

    private LoanType loanType;

    private Double loanAmount;
    private Integer tenureMonths;
    private Double interestRate;

    private Double emiAmount;
    private Double outstandingPrincipal;
    private Double totalInterestPayable;

    private LoanStatus status;
    private Boolean emiEligible;

    private LocalDate appliedDate;
    private LocalDate approvedDate;
    private LocalDate disbursedDate;

    // Loan-type specific embedded documents (ONLY ONE should be non-null)
    private PersonalLoanDetails personalLoanDetails;
    private EducationLoanDetails educationLoanDetails;
    private BusinessLoanDetails businessLoanDetails;
    private VehicleLoanDetails vehicleLoanDetails;
}
