# Reimbursements Management Tool

A backend REST API for managing employee reimbursement requests with a multi-level approval workflow.

---

## Tech Stack

| Layer        | Technology             |
|-------------|------------------------|
| Runtime      | Node.js (JavaScript)   |
| Framework    | Express.js             |
| Database     | PostgreSQL              |
| Auth         | JWT + httpOnly cookies |
| Hashing      | bcrypt                 |
| Port         | 7002                   |

---

## Folder Structure

```
src/
├── config/        # DB pool and environment variables
├── controllers/   # HTTP request handlers
├── db/            # Migration and seed scripts
├── middlewares/   # authenticate, authorize, validate, errorHandler
├── routes/        # Express routers
├── services/      # Business logic
└── utils/         # AppError, apiResponse, jwt, hash helpers
app.js             # Express app setup
server.js          # HTTP server on port 7002
```

---

## Getting Started

### 1. Prerequisites

- Node.js >= 18
- PostgreSQL running locally

### 2. Clone and Install

```bash
cd RazorPay_Assignment
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env and fill in your DB credentials and JWT secret
```

### 4. Create the Database

In psql or pgAdmin:

```sql
CREATE DATABASE reimbursements_db;
```

### 5. Run Migrations

```bash
npm run db:migrate
```

Creates:
- Enums: `user_role`, `reimb_status`, `final_status`
- Tables: `users`, `employee_managers`, `reimbursements`

### 6. Seed Data

```bash
npm run db:seed-data
```

Seeds the CFO account:

| Field    | Value                 |
|----------|-----------------------|
| email    | cfo@org.com           |
| password | CFO#ORG@April2026     |
| role     | CFO                   |

### 7. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:7002`

---

## Roles

| Role | Description                        |
|------|------------------------------------|
| EMP  | Regular employee (default)         |
| RM   | Reporting Manager                  |
| APE  | Accounts Payable Executive         |
| CFO  | Chief Financial Officer            |

---

## Approval Flow

```
EMP creates reimbursement
    ↓
RM approves/rejects  (rm_status)
    ↓ (if approved)
APE approves/rejects (ape_status)
    ↓ (if approved)
CFO approves/rejects (cfo_status)

final_status = APPROVED  ←→  rm_status=APPROVED AND ape_status=APPROVED
final_status = REJECTED  ←→  any stage is REJECTED
```

---

## Environment Variables

| Variable        | Description                         | Default              |
|----------------|-------------------------------------|----------------------|
| PORT            | Server port                         | 7002                 |
| DB_HOST         | PostgreSQL host                     | localhost            |
| DB_PORT         | PostgreSQL port                     | 5432                 |
| DB_NAME         | Database name                       | reimbursements_db    |
| DB_USER         | PostgreSQL user                     | postgres             |
| DB_PASSWORD     | PostgreSQL password                 | -                    |
| JWT_SECRET      | Secret for signing JWT              | -                    |
| JWT_EXPIRES_IN  | Token expiry                        | 7d                   |
| COOKIE_MAX_AGE  | Cookie max age (ms)                 | 604800000 (7 days)   |
| NODE_ENV        | Environment                         | development          |

---

## API Reference

See [API_DOCS.md](./API_DOCS.md) for full endpoint documentation.

---

## Design Principles

- **SOLID**: Each module has a single responsibility; services are injected via require (easily replaceable)
- **Layered Architecture**: Route → Middleware → Controller → Service → DB
- **Error Handling**: Central `errorHandler` middleware; custom `AppError` for operational errors
- **Security**: Passwords hashed with bcrypt (12 rounds); JWT stored in httpOnly cookies; org-domain email restriction

---
