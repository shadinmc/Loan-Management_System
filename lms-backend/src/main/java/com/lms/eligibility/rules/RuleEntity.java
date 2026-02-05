package com.lms.eligibility.rules;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "decision_rules")
public class RuleEntity {

    @Id
    private String ruleId;

    private RuleType ruleType;

    private Double minValue;
    private Double maxValue;

    private boolean active;

    private String description;
}
