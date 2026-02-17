package com.lms.payment.stripe.repository;

import com.lms.payment.stripe.entity.StripeWalletPayment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StripeWalletPaymentRepository extends MongoRepository<StripeWalletPayment, String> {
    Optional<StripeWalletPayment> findByPaymentIntentId(String paymentIntentId);
}
