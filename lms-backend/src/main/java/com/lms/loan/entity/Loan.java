package com.lms.loan.entity;

import com.lms.common.enums.LoanStatus;
import com.lms.common.enums.LoanType;
import com.lms.loan.entity.embedded.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "loans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndex(name = "loan_user_idx", def = "{'loanId': 1, 'userId': 1}")
public class Loan {

    @Id
    private String id; // Mongo internal ID

    @Indexed(unique = true)
    private String loanId; // LN-XXXX

    @Indexed
    private String userId;

    private LoanType loanType;

    /* Financials (BigDecimal ONLY) */
    private BigDecimal loanAmount;
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private Integer cibilScore;


    private BigDecimal emiAmount;
    private BigDecimal outstandingPrincipal;
    private BigDecimal totalInterestPayable;


    /* Status */
    private LoanStatus status;

    /* Eligibility */
    private LocalDateTime eligibilityCheckedAt;
    private BigDecimal approvedAmount;
    private Boolean emiEligible;


    /* Dates */
    private LocalDate appliedDate;
    private LocalDate approvedDate;
    private LocalDate disbursedDate;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    /* Loan-type specific details (ONLY ONE NON-NULL) */
    private PersonalLoanDetails personalLoanDetails;
    private EducationLoanDetails educationLoanDetails;
    private BusinessLoanDetails businessLoanDetails;
    private VehicleLoanDetails vehicleLoanDetails;
}
