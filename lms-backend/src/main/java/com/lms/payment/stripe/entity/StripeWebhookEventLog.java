package com.lms.payment.stripe.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "stripe_webhook_events")
public class StripeWebhookEventLog {
    @Id
    private String id;

    @Indexed(unique = true)
    private String eventId;

    private String paymentIntentId;
    private String eventType;
    private LocalDateTime processedAt;
}
