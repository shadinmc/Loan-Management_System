package com.lms.audit.service;

import com.lms.audit.entity.AuditSequence;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class AuditSequenceService {

    private final MongoTemplate mongoTemplate;

    public AuditSequenceService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public long nextSequence() {
        Query query = new Query(where("_id").is("AUDIT_LOG"));
        Update update = new Update().inc("seq", 1);

        FindAndModifyOptions options = FindAndModifyOptions.options()
                .returnNew(true)
                .upsert(true);

        AuditSequence counter = mongoTemplate.findAndModify(
                query, update, options, AuditSequence.class
        );

        return counter.getSeq();
    }
}
