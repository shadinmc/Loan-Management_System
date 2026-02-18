# Stripe Gateway Setup (Test Mode)

This project now includes a separate Stripe gateway module:

- Backend module: `lms-backend/src/main/java/com/lms/payment/stripe`
- Frontend module: `frontend-user/src/modules/stripe-gateway`
- 3 payment pages:
  - `/wallet/payments/upi`
  - `/wallet/payments/card`
  - `/wallet/payments/netbanking`

## 1) What You Need To Provide

From your Stripe Dashboard (test mode):

1. `sk_test_...` (Secret Key)
2. `pk_test_...` (Publishable Key)
3. `whsec_...` (Webhook Secret, optional in local dev)

### Minimum required (simple mode)

You can run without webhook for local testing:

- Required: `sk_test_...` and `pk_test_...`
- Optional: `whsec_...`

## 2) Backend Configuration

Set these in `lms-backend/src/main/resources/application.properties`:

```properties
payment.stripe.secret-key=sk_test_xxx
payment.stripe.publishable-key=pk_test_xxx
payment.stripe.webhook-secret=
```

## 3) Frontend Configuration

Set in `frontend-user/.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_API_BASE_URL=http://localhost:8080/api
```

## 4) Install Dependencies

Frontend:

```bash
cd frontend-user
npm install
```

Backend:

```bash
cd lms-backend
mvn clean install
```

## 5) Optional: Run Stripe Webhook Forwarding

Install and login Stripe CLI, then run:

```bash
stripe login
stripe listen --forward-to http://localhost:8080/api/payments/stripe/webhook
```

Copy the webhook secret (`whsec_...`) printed by CLI to backend config only if you want webhook-based confirmation.

## 6) Test Cards / Methods

Card test number:

- `4242 4242 4242 4242`
- Any future expiry, any 3-digit CVC

For non-card methods in test mode, use Stripe's test flow in hosted/embedded UI as prompted by Payment Element.

## 7) Flow Summary

1. User enters amount in wallet payment page.
2. Frontend calls `POST /api/payments/stripe/create-intent`.
3. Stripe Elements confirms payment on frontend.
4. Frontend calls `POST /api/payments/stripe/confirm-wallet-topup`.
5. Optional webhook (`payment_intent.succeeded`) also credits wallet idempotently as fallback/async confirmation.

## 8) New API Endpoints

- `POST /api/payments/stripe/create-intent` (auth required)
- `POST /api/payments/stripe/confirm-wallet-topup` (auth required)
- `POST /api/payments/stripe/webhook` (public, Stripe signature required)
