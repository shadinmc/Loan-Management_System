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


## Screenshots

User Portal:
- Home:
  <img width="1876" height="1073" alt="home" src="https://github.com/user-attachments/assets/c38e37b2-b3ef-4951-b908-5b4734f2537c" />

- Login:
  <img width="1894" height="1084" alt="login" src="https://github.com/user-attachments/assets/2c549d9a-512c-4d42-acc6-31ff39433008" />

- Signup:
  <img width="1887" height="1075" alt="signup" src="https://github.com/user-attachments/assets/2c03b10a-e2ac-4575-b979-aea5c86811a2" />

- Dashboard:
  ![userdashboard](https://github.com/user-attachments/assets/c9494af6-6598-4426-8dd3-05e71e938977)

- KYC:
  ![kyc](https://github.com/user-attachments/assets/74db1f7c-f105-4cdb-b24d-392fba7bca6f)

- Wallet:
  ![wallet](https://github.com/user-attachments/assets/9a3c93f7-f43a-4c85-9d20-781a8b1f5c45)

- EMI Repayment:
  ![emirepyament](https://github.com/user-attachments/assets/ce4a5319-b1cf-4c0e-8f28-eb4b085c3a64)

- One Time Settlement:
  ![ots](https://github.com/user-attachments/assets/5b33ba2c-d4ec-4070-b687-c3bd59394a7b)

- Loan Apply:
  <img width="632" height="356" alt="loan" src="https://github.com/user-attachments/assets/bfcb3089-c067-433f-884c-bb228348ecca" />

  ![applyloan](https://github.com/user-attachments/assets/8f80c89a-867c-48b4-a40f-7b81d24f63d3)

- Loan Created:
  ![loancreated](https://github.com/user-attachments/assets/4fccc5d5-3526-43d1-be17-1cd7108a253a)

- Loan Status:
  ![loanstatus](https://github.com/user-attachments/assets/640aa091-6262-4886-8389-28d8303ffeae)

- Profile:
  ![profile](https://github.com/user-attachments/assets/872f551d-272a-43dd-b417-61c95c86caa7)


Admin Portal:
- Admin Login:
  ![managerlogin](https://github.com/user-attachments/assets/1ff101a2-4a2d-4b5b-8dd5-f40e4a315267)

- Branch Dashboard:
  ![branchdash](https://github.com/user-attachments/assets/5710ab3c-63cd-4ff4-abec-6ffc766ba2d7)

- Branch Loan Applications:
  <img width="1861" height="1053" alt="loanapproval" src="https://github.com/user-attachments/assets/5a750d27-d7ff-47f8-a578-088c864f5319" />

- Branch KYC Review:
  <img width="1870" height="1059" alt="kycapprove" src="https://github.com/user-attachments/assets/8ca9694b-8390-41cf-a83f-ccb2173b459e" />

- Regional Dashboard:
  ![regionaldash](https://github.com/user-attachments/assets/48af7b89-23bf-4957-8b36-b08ff48ab798)

- Regional Loan Applications:
  <img width="1875" height="1082" alt="regionalapprove" src="https://github.com/user-attachments/assets/76319695-4cf4-47a7-807c-8366924bdcb0" />
  
- Regional Repayments:
  ![regionalrepyament](https://github.com/user-attachments/assets/df940edf-3b7e-40c8-bdae-be6ae759191d)

- Regional Audit Logs:
  <img width="953" height="541" alt="auditlogs" src="https://github.com/user-attachments/assets/7964f76b-3530-4a97-8389-6316a80a0032" />



## Production Notes
- Externalize MongoDB config into environment properties for deployment.
- Lock down CORS to your production domains.
- Store secrets in a secure vault or environment manager.
- Run frontends behind a reverse proxy and serve the API on a stable domain.




