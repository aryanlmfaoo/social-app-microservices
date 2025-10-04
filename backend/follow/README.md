# Follow Microservice API

This microservice manages user follow relationships using a graph database.

## Base URL
```
http://your-api-domain.com/
```

---

## Endpoints

### 1. Add User

Adds a new user to the graph database. Called by the authentication service during user signup.

**Endpoint:** `POST /adduser`

**Request Body:**
```json
{
  "userid": "string",
  "email": "string",
  "username": "string"
}
```

**Success Response (201):**
```json
{
  "success": true
}
```

**Error Response (404 or 500):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

### 2. Remove User

Removes a user from the graph database. Called by the authentication service when a user deletes their account.

**Endpoint:** `DELETE /removeuser`

**Request Body:**
```json
{
  "userid": "string"
}
```

**Success Response (202):**
```json
{
  "success": true
}
```

**Error Response (404 or 500):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

### 3. Follow Request

Allows a user to follow another user.

**Endpoint:** `POST /follow`

**Request Body:**
```json
{
  "thisUserId": "string",
  "isFollowingThisUserId": "string"
}
```

**Success Response (201):**
```json
{
  "success": true
}
```

**Error Response (404 or 500):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

### 4. Unfollow Request

Allows a user to unfollow another user.

**Endpoint:** `DELETE /unfollow`

**Request Body:**
```json
{
  "thisUserId": "string",
  "isUnfollowingThisUserId": "string"
}
```

**Success Response (202):**
```json
{
  "success": true
}
```

**Error Response (404 or 500):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

### 5. Get Followers

Retrieves all followers of a specified user.

**Endpoint:** `GET /getfollowers?userid=`

**Query Parameters:**
- `userid`: The ID of the user whose followers are being retrieved.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  ]
}
```

**Error Response (404 or 500):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

## Error Handling

All endpoints return a consistent error format:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

Common error scenarios:
- User not found
- Invalid user ID
- Missing required fields
- Graph database connection issues
- Duplicate follow request

---

## Getting Started

### Prerequisites
- Node.js
- Graph database connection configured (Neo4j)

### Installation
```bash
npm install
```

### Environment Variables
Check `.env.example` for required environment variables.

### Running the Service
```bash
npm run dev
```

---

## Notes
- All requests should be sent securely over HTTPS.
- Ensure the graph database is properly indexed for performance.
- This service integrates with the authentication microservice for user management.
- I used Grok to write this README because I'm too lazy to write one myself, but the code is human written.