# Authentication Microservice API

This microservice handles user authentication, registration, and password recovery.

## Base URL
```
http://your-api-domain.com/
```

---

## Endpoints

### 1. Login

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "emailOrUsername": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_string"
}
```

**Error Response (200):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

### 2. Signup

Registers a new user and returns a JWT token.

**Endpoint:** `POST /signup`

**Request Body:**
```json
{
  "name": "string",
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_string"
}
```

**Error Response (200):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

### 3. Forgot Password Request

Initiates the password reset process by sending a reset link to the user's email.

**Endpoint:** `POST /forgotpasswordreq`

**Request Body:**
```json
{
  "emailOrUsername": "string"
}
```

**Success Response (200):**
```json
{
  "success": true
}
```
*Note: A password reset link will be sent to the user's registered email address.*

**Error Response (200):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

### 4. Reset Password

Resets the user's password using the token from the reset link.

**Endpoint:** `POST /forgotpassword`

**Request Body:**
```json
{
  "userid": "string",
  "token": "string",
  "newPassword": "string"
}
```

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (200):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

## Authentication

After successful login or signup, use the returned JWT token in subsequent requests:

```
Authorization: Bearer <jwt_token>
```

---

## Error Handling

All endpoints return a consistent error format:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

Common error scenarios:
- Invalid credentials
- User already exists
- Missing required fields
- Invalid or expired reset token
- User not found

---

## Getting Started

### Prerequisites
- Node.js (if applicable)
- Database connection configured(prisma ORM)

### Installation
```bash
npm install
```

### Environment Variables
check ```.env.example```

### Running the Service
```bash
npm run dev
```

---

## Notes
- All passwords should be sent securely over HTTPS
- JWT tokens have an expiration time (configure as needed)
- Password reset tokens are single-use and time-limited(15 minutes)
- I did use claude for this README, im too lazy to write one.