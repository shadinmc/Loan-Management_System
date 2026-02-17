package com.lms.payment.stripe.service;

import com.lms.auth.security.SecurityUtils;
import com.lms.payment.stripe.dto.StripeConfirmPaymentRequest;
import com.lms.payment.stripe.dto.StripeCreatePaymentIntentRequest;
import com.lms.payment.stripe.dto.StripeCreatePaymentIntentResponse;
import com.lms.payment.stripe.dto.StripePaymentStatusResponse;
import com.lms.payment.stripe.entity.StripeWalletPayment;
import com.lms.payment.stripe.entity.StripeWebhookEventLog;
import com.lms.payment.stripe.repository.StripeWalletPaymentRepository;
import com.lms.payment.stripe.repository.StripeWebhookEventLogRepository;
import com.lms.wallet.service.WalletService;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class StripeWalletPaymentService {

    private final SecurityUtils securityUtils;
    private final WalletService walletService;
    private final StripeWalletPaymentRepository stripeWalletPaymentRepository;
    private final StripeWebhookEventLogRepository stripeWebhookEventLogRepository;

    @Value("${payment.stripe.secret-key:}")
    private String stripeSecretKey;

    @Value("${payment.stripe.publishable-key:}")
    private String stripePublishableKey;

    @Value("${payment.stripe.webhook-secret:}")
    private String stripeWebhookSecret;

    public StripeCreatePaymentIntentResponse createPaymentIntent(StripeCreatePaymentIntentRequest request) {
        ensureStripeConfigured();
        Stripe.apiKey = stripeSecretKey;

        String userId = securityUtils.getCurrentUserId();
        String method = normalizeMethod(request.getMethod());
        BigDecimal amount = normalizeAmount(request.getAmount());
        validateMethodLimit(method, amount);

        long amountMinor = toMinor(amount);
        String effectiveMethod = method;
        PaymentIntentCreateParams params = buildCreateParams(userId, amountMinor, method, method);

        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            upsertPaymentRecord(userId, paymentIntent, effectiveMethod, amount, false);
            return new StripeCreatePaymentIntentResponse(
                    paymentIntent.getId(),
                    paymentIntent.getClientSecret(),
                    paymentIntent.getStatus(),
                    paymentIntent.getCurrency(),
                    effectiveMethod,
                    paymentIntent.getAmount(),
                    stripePublishableKey
            );
        } catch (StripeException ex) {
            // Fallback for accounts where UPI/Net Banking is not enabled in Stripe.
            if (!"card".equals(method) && isUnsupportedPaymentType(ex)) {
                try {
                    effectiveMethod = "card";
                    PaymentIntent fallbackIntent = PaymentIntent.create(
                            buildCreateParams(userId, amountMinor, effectiveMethod, method)
                    );
                    upsertPaymentRecord(userId, fallbackIntent, effectiveMethod, amount, false);
                    return new StripeCreatePaymentIntentResponse(
                            fallbackIntent.getId(),
                            fallbackIntent.getClientSecret(),
                            fallbackIntent.getStatus(),
                            fallbackIntent.getCurrency(),
                            effectiveMethod,
                            fallbackIntent.getAmount(),
                            stripePublishableKey
                    );
                } catch (StripeException fallbackEx) {
                    throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, fallbackEx.getMessage(), fallbackEx);
                }
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, ex.getMessage(), ex);
        }
    }

    public StripePaymentStatusResponse confirmPayment(StripeConfirmPaymentRequest request) {
        ensureStripeConfigured();
        Stripe.apiKey = stripeSecretKey;

        String userId = securityUtils.getCurrentUserId();
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(request.getPaymentIntentId());
            String metadataUserId = paymentIntent.getMetadata() != null ? paymentIntent.getMetadata().get("userId") : null;
            if (metadataUserId == null || !metadataUserId.equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Payment does not belong to current user");
            }
            StripeWalletPayment record = upsertPaymentRecord(
                    userId,
                    paymentIntent,
                    paymentIntent.getMetadata().getOrDefault("method", "card"),
                    fromMinor(paymentIntent.getAmount()),
                    false
            );
            if ("succeeded".equalsIgnoreCase(paymentIntent.getStatus())) {
                record = creditWalletIfNeeded(record, paymentIntent);
            }
            return new StripePaymentStatusResponse(
                    paymentIntent.getId(),
                    paymentIntent.getStatus(),
                    record.isWalletCredited()
            );
        } catch (StripeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, ex.getMessage(), ex);
        }
    }

    public void processWebhook(String payload, String signatureHeader) {
        ensureStripeConfigured();
        if (stripeWebhookSecret == null || stripeWebhookSecret.isBlank()) {
            // Dev mode fallback: webhook is optional when confirm endpoint is used.
            log.warn("Stripe webhook secret not configured; skipping webhook processing.");
            return;
        }
        Event event;
        try {
            event = Webhook.constructEvent(payload, signatureHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Stripe signature", ex);
        }

        if (stripeWebhookEventLogRepository.existsByEventId(event.getId())) {
            return;
        }

        Stripe.apiKey = stripeSecretKey;
        String eventType = event.getType();
        StripeObject stripeObject = event.getDataObjectDeserializer().getObject().orElse(null);
        if (!(stripeObject instanceof PaymentIntent paymentIntent)) {
            saveWebhookEvent(event.getId(), null, eventType);
            return;
        }

        String method = paymentIntent.getMetadata() != null
                ? paymentIntent.getMetadata().getOrDefault("method", "card")
                : "card";
        String userId = paymentIntent.getMetadata() != null ? paymentIntent.getMetadata().get("userId") : null;

        StripeWalletPayment record = upsertPaymentRecord(
                userId,
                paymentIntent,
                method,
                fromMinor(paymentIntent.getAmount()),
                false
        );

        if ("payment_intent.succeeded".equals(eventType)) {
            creditWalletIfNeeded(record, paymentIntent);
        }
        saveWebhookEvent(event.getId(), paymentIntent.getId(), eventType);
    }

    private StripeWalletPayment creditWalletIfNeeded(StripeWalletPayment record, PaymentIntent paymentIntent) {
        if (record.isWalletCredited()) {
            return record;
        }
        String userId = record.getUserId();
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing userId in payment metadata");
        }
        long paidMinor = paymentIntent.getAmountReceived() != null && paymentIntent.getAmountReceived() > 0
                ? paymentIntent.getAmountReceived()
                : paymentIntent.getAmount();
        BigDecimal paidAmount = fromMinor(paidMinor);

        walletService.creditForLoanSystem(userId, "STRIPE_WALLET_TOPUP", paidAmount);
        record.setWalletCredited(true);
        record.setWalletCreditedAt(LocalDateTime.now());
        record.setStatus(paymentIntent.getStatus());
        record.setUpdatedAt(LocalDateTime.now());
        return stripeWalletPaymentRepository.save(record);
    }

    private StripeWalletPayment upsertPaymentRecord(
            String userId,
            PaymentIntent paymentIntent,
            String method,
            BigDecimal amount,
            boolean walletCredited
    ) {
        StripeWalletPayment record = stripeWalletPaymentRepository.findByPaymentIntentId(paymentIntent.getId())
                .orElseGet(() -> StripeWalletPayment.builder()
                        .paymentIntentId(paymentIntent.getId())
                        .createdAt(LocalDateTime.now())
                        .build());
        if (record.getUserId() == null) {
            record.setUserId(userId);
        }
        record.setMethod(method);
        record.setCurrency(paymentIntent.getCurrency());
        record.setAmount(amount);
        record.setStatus(paymentIntent.getStatus());
        record.setWalletCredited(record.isWalletCredited() || walletCredited);
        record.setUpdatedAt(LocalDateTime.now());
        return stripeWalletPaymentRepository.save(record);
    }

    private void saveWebhookEvent(String eventId, String paymentIntentId, String eventType) {
        StripeWebhookEventLog logRecord = StripeWebhookEventLog.builder()
                .eventId(eventId)
                .paymentIntentId(paymentIntentId)
                .eventType(eventType)
                .processedAt(LocalDateTime.now())
                .build();
        stripeWebhookEventLogRepository.save(logRecord);
    }

    private BigDecimal normalizeAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than 0");
        }
        return amount.setScale(2, RoundingMode.HALF_UP);
    }

    private String normalizeMethod(String method) {
        if (method == null || method.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment method is required");
        }
        return method.toLowerCase(Locale.ROOT);
    }

    private void validateMethodLimit(String method, BigDecimal amount) {
        BigDecimal max = switch (method) {
            case "upi" -> new BigDecimal("100000");
            case "card" -> new BigDecimal("500000");
            case "netbanking" -> new BigDecimal("1000000");
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported payment method");
        };
        if (amount.compareTo(max) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Maximum add money limit for " + method + " is ₹" + max.toPlainString()
            );
        }
    }

    private long toMinor(BigDecimal amount) {
        return amount.multiply(new BigDecimal("100")).longValueExact();
    }

    private BigDecimal fromMinor(long amountMinor) {
        return BigDecimal.valueOf(amountMinor).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    }

    private void ensureStripeConfigured() {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Stripe secret key is not configured");
        }
    }

    private PaymentIntentCreateParams buildCreateParams(
            String userId,
            long amountMinor,
            String method,
            String requestedMethod
    ) {
        List<String> paymentMethodTypes = switch (method) {
            case "upi" -> List.of("upi");
            case "card" -> List.of("card");
            case "netbanking" -> List.of("netbanking");
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported payment method");
        };

        return PaymentIntentCreateParams.builder()
                .setAmount(amountMinor)
                .setCurrency("inr")
                .addAllPaymentMethodType(paymentMethodTypes)
                .putMetadata("userId", userId)
                .putMetadata("purpose", "wallet_topup")
                .putMetadata("method", method)
                .putMetadata("requestedMethod", requestedMethod)
                .build();
    }

    private boolean isUnsupportedPaymentType(StripeException ex) {
        String msg = ex.getMessage();
        return msg != null && msg.toLowerCase(Locale.ROOT).contains("payment method type");
    }
}
