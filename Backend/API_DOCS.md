# API Documentation — Reimbursements Management Tool

Base URL: `http://localhost:7002/rest`

All responses follow this structure:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... }   // present on success
}
```

Authentication: JWT stored in an `auth_token` httpOnly cookie. Include the cookie in all protected requests.

---

## Health Check

### `GET /health`

**Auth required:** No

**Response 200:**
```json
{ "success": true, "message": "Reimbursements API is running." }
```

---

## Onboarding

### `POST /rest/onboardings/register`

Register a new employee account. Only `@org.com` emails are accepted. Role is automatically set to `EMP`.

**Auth required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@org.com",
  "password": "SecurePass@123"
}
```

**Responses:**

| Code | Description |
|------|-------------|
| 201  | User registered successfully |
| 400  | Missing fields / non-org.com email |
| 409  | Email already registered |

**Success Response:**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "id": 2,
    "name": "John Doe",
    "email": "john@org.com",
    "role": "EMP",
    "created_at": "2026-06-24T09:00:00.000Z"
  }
}
```

---

### `POST /rest/onboardings/login`

Authenticate and receive a JWT in an httpOnly cookie.

**Auth required:** No

**Request Body:**
```json
{
  "email": "cfo@org.com",
  "password": "CFO#ORG@April2026"
}
```

**Responses:**

| Code | Description |
|------|-------------|
| 200  | Login successful, cookie set |
| 400  | Missing fields |
| 401  | Invalid email or password |

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "id": 1,
    "name": "CFO Admin",
    "email": "cfo@org.com",
    "role": "CFO"
  }
}
```

---

### `POST /rest/onboardings/logout`

Clear the auth cookie.

**Auth required:** No

**Response 200:**
```json
{ "success": true, "message": "Logged out successfully." }
```

---

## Roles

### `POST /rest/roles/assign`

Assign a role to an existing user.

**Auth required:** Yes — **CFO only**

**Request Body:**
```json
{
  "userId": 2,
  "role": "RM"
}
```

Valid roles: `EMP`, `RM`, `APE`, `CFO`

**Responses:**

| Code | Description |
|------|-------------|
| 200  | Role updated |
| 400  | Invalid role or missing fields |
| 401  | Not authenticated |
| 403  | Not CFO |
| 404  | User not found |

**Success Response:**
```json
{
  "success": true,
  "message": "Role updated to RM for user john@org.com.",
  "data": {
    "id": 2,
    "name": "John Doe",
    "email": "john@org.com",
    "role": "RM"
  }
}
```

---

## Employees

### `POST /rest/employees/assign`

Assign an EMP to an RM.

**Auth required:** Yes — **CFO or APE**

**Request Body:**
```json
{
  "employeeId": 3,
  "managerId": 2
}
```

**Responses:**

| Code | Description |
|------|-------------|
| 201  | Assignment created |
| 400  | Invalid roles / missing fields |
| 403  | Forbidden |
| 404  | User not found |
| 409  | Assignment already exists |

---

### `DELETE /rest/employees/assign`

Remove an EMP from an RM.

**Auth required:** Yes — **CFO or APE**

**Request Body:**
```json
{
  "employeeId": 3,
  "managerId": 2
}
```

**Responses:**

| Code | Description |
|------|-------------|
| 200  | Assignment removed |
| 400  | Missing fields |
| 403  | Forbidden |
| 404  | Assignment not found |

---

### `GET /rest/employees`

List employees (role-filtered).

**Auth required:** Yes — **RM, APE, CFO** (EMP gets 403)

| Role | Returns |
|------|---------|
| RM   | Only subordinate EMPs |
| APE  | All EMPs and RMs |
| CFO  | All users |

**Response 200:**
```json
{
  "success": true,
  "message": "Employees retrieved successfully.",
  "data": [
    { "id": 3, "name": "Jane Smith", "email": "jane@org.com", "role": "EMP", "created_at": "..." }
  ]
}
```

---

## Reimbursements

### `POST /rest/reimbursements`

Create a reimbursement request.

**Auth required:** Yes — **EMP only**

**Request Body:**
```json
{
  "title": "Flight to Mumbai",
  "description": "Business travel for client meeting",
  "amount": 4500.00
}
```

> `description` is optional. `title` and `amount` are required.

**Responses:**

| Code | Description |
|------|-------------|
| 201  | Created |
| 400  | Missing fields / invalid amount |
| 403  | Not EMP |

**Success Response:**
```json
{
  "success": true,
  "message": "Reimbursement created successfully.",
  "data": {
    "id": 1,
    "employee_id": 3,
    "title": "Flight to Mumbai",
    "description": "Business travel for client meeting",
    "amount": "4500.00",
    "rm_status": "PENDING",
    "ape_status": "PENDING",
    "cfo_status": "PENDING",
    "final_status": "PENDING",
    "created_at": "2026-06-24T09:00:00.000Z",
    "updated_at": "2026-06-24T09:00:00.000Z"
  }
}
```

---

### `PATCH /rest/reimbursements`

Approve or reject a reimbursement.

**Auth required:** Yes — **RM, APE, or CFO**

**Request Body:**
```json
{
  "reimbursementId": 1,
  "action": "APPROVED"
}
```

`action` must be `"APPROVED"` or `"REJECTED"`.

**Role-specific rules:**

| Role | Can act when | Updates |
|------|-------------|---------|
| RM   | rm_status = PENDING (and is manager of employee) | rm_status |
| APE  | rm_status = APPROVED AND ape_status = PENDING | ape_status |
| CFO  | ape_status = APPROVED AND cfo_status = PENDING | cfo_status |

**final_status logic:**
- `rm_status = APPROVED` AND `ape_status = APPROVED` → `final_status = APPROVED`
- Any stage `= REJECTED` → `final_status = REJECTED`

**Responses:**

| Code | Description |
|------|-------------|
| 200  | Action applied |
| 400  | Invalid action / wrong stage |
| 403  | Not authorised / not manager |
| 404  | Reimbursement not found |

---

### `GET /rest/reimbursements`

List reimbursements (role-filtered).

**Auth required:** Yes — all roles

| Role | Returns |
|------|---------|
| EMP  | Own reimbursements (all statuses) |
| RM   | Subordinates' reimbursements where `rm_status = PENDING` |
| APE  | Reimbursements where `rm_status = APPROVED` AND `ape_status = PENDING` |
| CFO  | Reimbursements where `ape_status = APPROVED` |

**Response 200:**
```json
{
  "success": true,
  "message": "Reimbursements retrieved successfully.",
  "data": [ { ... } ]
}
```

---

### `GET /rest/reimbursements/:userId`

Get all reimbursements of a specific subordinate employee.

**Auth required:** Yes — **RM only**

**Path Parameter:** `userId` — ID of the subordinate employee

**Responses:**

| Code | Description |
|------|-------------|
| 200  | Success |
| 403  | Not RM or not manager of that user |
| 404  | User not found |

**Success Response:**
```json
{
  "success": true,
  "message": "Subordinate reimbursements retrieved successfully.",
  "data": [ { ... } ]
}
```

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description here."
}
```

With validation errors:
```json
{
  "success": false,
  "message": "Missing required field(s): email, password"
}
```

---

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK |
| 201  | Created |
| 400  | Bad Request (validation / business rule) |
| 401  | Unauthorized (not logged in / bad token) |
| 403  | Forbidden (wrong role) |
| 404  | Not Found |
| 409  | Conflict (duplicate) |
| 500  | Internal Server Error |
