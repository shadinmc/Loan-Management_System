package com.lms.payment.stripe.dto;

public class StripeCreatePaymentIntentResponse {
    private String paymentIntentId;
    private String clientSecret;
    private String status;
    private String currency;
    private String method;
    private long amountMinor;
    private String publishableKey;

    public StripeCreatePaymentIntentResponse() {
    }

    public StripeCreatePaymentIntentResponse(
            String paymentIntentId,
            String clientSecret,
            String status,
            String currency,
            String method,
            long amountMinor,
            String publishableKey
    ) {
        this.paymentIntentId = paymentIntentId;
        this.clientSecret = clientSecret;
        this.status = status;
        this.currency = currency;
        this.method = method;
        this.amountMinor = amountMinor;
        this.publishableKey = publishableKey;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public long getAmountMinor() {
        return amountMinor;
    }

    public void setAmountMinor(long amountMinor) {
        this.amountMinor = amountMinor;
    }

    public String getPublishableKey() {
        return publishableKey;
    }

    public void setPublishableKey(String publishableKey) {
        this.publishableKey = publishableKey;
    }
}
