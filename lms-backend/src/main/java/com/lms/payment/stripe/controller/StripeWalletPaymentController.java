package com.lms.payment.stripe.controller;

import com.lms.payment.stripe.dto.StripeConfirmPaymentRequest;
import com.lms.payment.stripe.dto.StripeCreatePaymentIntentRequest;
import com.lms.payment.stripe.dto.StripeCreatePaymentIntentResponse;
import com.lms.payment.stripe.dto.StripePaymentStatusResponse;
import com.lms.payment.stripe.service.StripeWalletPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments/stripe")
@RequiredArgsConstructor
public class StripeWalletPaymentController {

    private final StripeWalletPaymentService stripeWalletPaymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<StripeCreatePaymentIntentResponse> createIntent(
            @RequestBody @Valid StripeCreatePaymentIntentRequest request
    ) {
        return ResponseEntity.ok(stripeWalletPaymentService.createPaymentIntent(request));
    }

    @PostMapping("/confirm-wallet-topup")
    public ResponseEntity<StripePaymentStatusResponse> confirmWalletTopup(
            @RequestBody @Valid StripeConfirmPaymentRequest request
    ) {
        return ResponseEntity.ok(stripeWalletPaymentService.confirmPayment(request));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String stripeSignature
    ) {
        stripeWalletPaymentService.processWebhook(payload, stripeSignature);
        return ResponseEntity.ok().build();
    }
}
