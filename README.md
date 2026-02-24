# Loan Management System (LMS)

A full-stack Loan Management System that models real-world banking workflows end-to-end. Users can register, complete KYC, apply for loans, make repayments, and track loan status. Branch and regional managers perform eligibility checks, approvals, disbursements, and closures with full auditability.

## Overview
The LMS is built to enforce data integrity, role-based security, idempotent operations, and automated processing. It simulates a production-grade loan lifecycle with dummy wallet-based payments (no real payment provider required).

## Key Features
- End-to-end loan lifecycle: application, review, approval, disbursement, activation, repayment, closure.
- KYC capture and verification with manager workflows.
- Role-based access control for users, branch managers, and regional managers.
- Idempotent processing for critical operations (loan application, KYC, decisioning flows).
- Audit logging for critical events and actions.
- Automated schedulers for disbursement and activation flows.
- Dummy payment handling through an internal wallet ledger for safe testing.

## Architecture
- `lms-backend`: Spring Boot REST API with MongoDB persistence.
- `frontend-user`: Customer-facing React app (loan application, KYC, wallet, repayments).
- `frontend-admin`: Admin portals for branch and regional managers.

## Roles And Access
- `USER`: Loan applicant and borrower.
- `BRANCH_MANAGER`: Eligibility checks, KYC review, branch-level decisions.
- `REGIONAL_MANAGER`: Final approval, disbursement, audit access.

## Business Flow
- User registration and authentication.
- KYC submission and verification.
- Loan application with idempotency protection.
- Eligibility checks by branch manager.
- Final approval by regional manager.
- Automated disbursement to wallet.
- Loan activation and EMI schedule generation.
- EMI payments or one-time settlement (OTS) by user.
- Loan closure by manager.
- Audit logs recorded for major actions.

## API Surface (High-Level)
Base path: `http://localhost:8080/api`

- `POST /auth/*`: Signup, login.
- `GET /user/*`: User profile.
- `POST /kyc/*`: KYC submission.
- `GET /loans/*`, `POST /loans/*`: Loan application and status.
- `POST /branch/*`: Branch manager eligibility and decisions.
- `POST /regional/*`: Regional manager approvals and audit access.
- `POST /disbursements/*`: Disbursement operations.
- `POST /repayments/*`: EMI, prepayment, OTS, repayment dashboards.
- `GET /wallet/*`: Wallet balance and transactions.

## Idempotency
- Supported via `X-Idempotency-Key` header for critical actions.
- The backend returns `X-Idempotency-Replay: true` when a request is replayed.

## Audit Logging
- Actions are logged server-side with masking for sensitive fields.
- Regional manager endpoints include audit access.

## Tech Stack
- Backend: Spring Boot 4, Java 21, MongoDB, JWT (jjwt), Maven.
- Frontend: React 19, Vite 7, React Router, Axios, TanStack Query.
- Testing: JUnit (backend), Vitest + Testing Library (frontend).

## Project Structure
- `lms-backend/` Spring Boot API
- `frontend-user/` Customer portal (loan lifecycle)
- `frontend-admin/` Admin portals (branch and regional)

## Prerequisites
- Java 21
- Maven 3.9+
- Node.js 18+ (20+ recommended)
- MongoDB running locally

## Configuration
### Backend
MongoDB is configured in `lms-backend/src/main/java/com/lms/config/MongoJavaConfig.java`:
- URI: `mongodb://localhost:27017`
- Database: `lms_dev`

Application settings:
- `lms-backend/src/main/resources/application.yml`

### Frontend User
Create or update `frontend-user/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Frontend Admin
Create `frontend-admin/.env` if you want to override the API base URL:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Local Development
### Backend
```bash
cd lms-backend
mvn spring-boot:run
```

### Frontend User
```bash
cd frontend-user
npm install
npm run dev
```

### Frontend Admin
```bash
cd frontend-admin
npm install
npm run dev
```

Notes:
- Vite defaults to `5173`. If both frontends run at once, the second will use `5174`.
- CORS is configured for `http://localhost:5173` and `http://localhost:3000` in `lms-backend/src/main/java/com/lms/config/CorsConfig.java`. Update this list for production domains or different local ports.

## Tests
### Backend
```bash
cd lms-backend
mvn test
```

### Frontend User
```bash
cd frontend-user
npm test
```

### Frontend Admin
```bash
cd frontend-admin
npm test
```

## Build
### Backend
```bash
cd lms-backend
mvn clean package
```

### Frontend User
```bash
cd frontend-user
npm run build
```

### Frontend Admin
```bash
cd frontend-admin
npm run build
```

## Payment Handling
The system uses an internal wallet ledger to simulate payments (UPI, card, net banking) for safe testing without real transactions. Stripe-related pages exist in the UI for optional test-mode integration, but the default LMS flow works without any external provider.

If you plan to wire Stripe in the future, see `STRIPE_GATEWAY_SETUP.md`.

## Screenshots
Place screenshots under `docs/screenshots/` and update filenames below after upload.

User Portal:
- Home (Loan Types): `docs/screenshots/user-home.png`
- Login: `docs/screenshots/user-login.png`
- Signup: `docs/screenshots/user-signup.png`
- Dashboard: `docs/screenshots/user-dashboard.png`
- KYC: `docs/screenshots/user-kyc.png`
- Wallet: `docs/screenshots/user-wallet.png`
- Wallet Transactions: `docs/screenshots/user-wallet-transactions.png`
- Wallet Payment - UPI: `docs/screenshots/user-wallet-upi.png`
- Wallet Payment - Card: `docs/screenshots/user-wallet-card.png`
- Wallet Payment - NetBanking: `docs/screenshots/user-wallet-netbanking.png`
- Loan Apply: `docs/screenshots/user-loan-apply.png`
- Loan Confirmation: `docs/screenshots/user-loan-confirmation.png`
- Loan Status: `docs/screenshots/user-loan-status.png`
- Repayments: `docs/screenshots/user-repayments.png`
- Profile: `docs/screenshots/user-profile.png`
- Terms: `docs/screenshots/user-terms.png`
- Privacy: `docs/screenshots/user-privacy.png`

Admin Portal:
- Admin Login: `docs/screenshots/admin-login.png`
- Branch Dashboard: `docs/screenshots/admin-branch-dashboard.png`
- Branch Loan Applications: `docs/screenshots/admin-branch-loan-applications.png`
- Branch KYC Review: `docs/screenshots/admin-branch-kyc.png`
- Branch Disbursements: `docs/screenshots/admin-branch-disbursements.png`
- Branch Repayments: `docs/screenshots/admin-branch-repayments.png`
- Regional Dashboard: `docs/screenshots/admin-regional-dashboard.png`
- Regional Loan Applications: `docs/screenshots/admin-regional-loan-applications.png`
- Regional KYC Review: `docs/screenshots/admin-regional-kyc.png`
- Regional Disbursements: `docs/screenshots/admin-regional-disbursements.png`
- Regional Repayments: `docs/screenshots/admin-regional-repayments.png`
- Regional Audit Logs: `docs/screenshots/admin-regional-audit-logs.png`

Once images are uploaded, update the list above to actual filenames and optionally render them inline like:
```markdown
![User Dashboard](docs/screenshots/user-dashboard.png)
```

## Production Notes
- Externalize MongoDB config into environment properties for deployment.
- Lock down CORS to your production domains.
- Store secrets in a secure vault or environment manager.
- Run frontends behind a reverse proxy and serve the API on a stable domain.

## License
Add your license here.
