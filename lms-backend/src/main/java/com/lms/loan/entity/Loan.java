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
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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

    private BigDecimal emiAmount;
    private BigDecimal outstandingPrincipal;
    private BigDecimal totalInterestPayable;


    /* Status */
    private LoanStatus status;

    /* Eligibility */
    private Instant eligibilityCheckedAt;
    private BigDecimal approvedAmount;
    private Boolean emiEligible;
    private Integer eligibilityScore;
    private Integer cibilScore;
    private String eligibilityRemarks;
    private List<String> passedRules;
    private List<String> failedRules;
    private LoanStatus recommendedStatus;

    private String decisionMessage;   // reason / clarification note

    /* Dto Updated with decision message */
    /* Dates */
    private Instant appliedDate;
    private Instant approvedDate;
    private Instant disbursedDate;
    private Instant updatedAt;
    private Instant createdAt;
    private Instant decisionAt;
    private Instant activationScheduledAt;
    private Instant activatedAt;
    private Instant closedAt;

    private Boolean emiScheduleGenerated;




    /* Loan-type specific details (ONLY ONE NON-NULL) */
    private PersonalLoanDetails personalLoanDetails;
    private EducationLoanDetails educationLoanDetails;
    private BusinessLoanDetails businessLoanDetails;
    private VehicleLoanDetails vehicleLoanDetails;

    // Regional review info
    private Instant regionalReviewedAt;
    private String regionalRemarks;
    private Boolean regionalApproved;

    // Disbursement
    private Instant disbursementScheduledAt;
    private Instant disbursedAt;
    private String transactionId;

}
