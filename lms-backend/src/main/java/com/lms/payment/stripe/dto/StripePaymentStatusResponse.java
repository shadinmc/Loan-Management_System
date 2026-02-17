package com.lms.payment.stripe.dto;

public class StripePaymentStatusResponse {
    private String paymentIntentId;
    private String status;
    private boolean walletCredited;

    public StripePaymentStatusResponse() {
    }

    public StripePaymentStatusResponse(String paymentIntentId, String status, boolean walletCredited) {
        this.paymentIntentId = paymentIntentId;
        this.status = status;
        this.walletCredited = walletCredited;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isWalletCredited() {
        return walletCredited;
    }

    public void setWalletCredited(boolean walletCredited) {
        this.walletCredited = walletCredited;
    }
}
