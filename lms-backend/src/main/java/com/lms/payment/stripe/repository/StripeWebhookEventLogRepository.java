package com.lms.payment.stripe.repository;

import com.lms.payment.stripe.entity.StripeWebhookEventLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StripeWebhookEventLogRepository extends MongoRepository<StripeWebhookEventLog, String> {
    boolean existsByEventId(String eventId);
}
