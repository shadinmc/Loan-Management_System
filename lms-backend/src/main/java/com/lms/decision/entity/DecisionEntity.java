package com.lms.decision.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "loan_decisions")
public class DecisionEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    private String loanId;   //  one decision per loan

    private boolean approved;
    private List<String> reasons;
    private LocalDateTime decidedAt;
}
