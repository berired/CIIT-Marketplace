# Authentication & Protected Routes Verification Guide

## Overview
This guide verifies that the authentication flow works end-to-end and that all protected routes properly enforce authentication and authorization checks.

---

## Complete Authentication Flow Test

### 1. Register New User
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "email": "testuser@ciit.edu.ph",
  "password": "TestPassword123",
  "fullName": "Test User"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "unique-user-id",
    "email": "testuser@ciit.edu.ph",
    "fullName": "Test User",
    "isAdmin": false
  }
}
```

**Console Log:** ✅ `User registered: Test User (testuser@ciit.edu.ph)`

**What's Happening:**
- Firebase creates new user with email/password (encrypted)
- User profile stored in Firestore `users` collection
- JWT token generated (7-day expiry)
- Token structure: `{ uid: "user-id", email: "normalized-email@ciit.edu.ph" }`

---

### 2. Login with Credentials
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "testuser@ciit.edu.ph",
  "password": "TestPassword123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "unique-user-id",
    "email": "testuser@ciit.edu.ph",
    "fullName": "Test User",
    "isAdmin": false,
    "rating": 5,
    "reviews": 0
  }
}
```

**Console Log:** ✅ `User logged in: Test User (testuser@ciit.edu.ph)`

**What's Happening:**
1. Email normalized to lowercase
2. Firebase Authentication verifies password
3. User profile fetched from Firestore
4. isAdmin field added to response
5. JWT token generated with userId and email
6. Token expires in 7 days

**Critical Checks:**
- ✅ Email is normalized (case-insensitive)
- ✅ Password is validated against Firebase
- ✅ User profile exists in Firestore
- ✅ Token includes necessary claims

---

### 3. Get Current User (Verify Token Works)
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Current user retrieved",
  "user": {
    "uid": "unique-user-id",
    "email": "testuser@ciit.edu.ph",
    "fullName": "Test User",
    "isAdmin": false
  }
}
```

**Test Invalid Token (401):**
```
Authorization: Bearer invalid-token-here
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

## Protected Route Tests

### 4. Create Listing (Requires Authentication)
**Endpoint:** `POST /api/listings`

**Headers:**
```
Authorization: Bearer <valid-token>
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Used Laptop",
  "price": 15000,
  "category": "electronics",
  "condition": "good",
  "description": "Dell laptop in good condition. Minor scratches. Works perfectly.",
  "image": "https://..."
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "listing": {
    "id": "listing-id",
    "title": "Used Laptop",
    "price": 15000,
    "sellerId": "unique-user-id",
    "seller": "Test User",
    "status": "active",
    "datePosted": "2025-03-17T15:30:00.000Z"
  }
}
```

**Console Log:** ✅ `Listing created by Test User: "Used Laptop" (ID: listing-id)`

**Test Without Token (401):**
```
(No Authorization header)
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "No token provided. Please authenticate."
}
```

**Test With Invalid Token (401):**
```
Authorization: Bearer invalid-token
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### 5. Update Own Listing (Ownership Verification)
**Endpoint:** `PUT /api/listings/:listingId`

**Headers:**
```
Authorization: Bearer <token-from-creator>
```

**Request:**
```json
{
  "title": "Used Laptop - Updated Price",
  "price": 12000
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Listing updated successfully"
}
```

**Test Updating Other User's Listing (403):**
Create a listing with User A, then try to update it with User B's token.

**Headers:**
```
Authorization: Bearer <token-from-different-user>
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "You can only edit your own listings"
}
```

---

### 6. Delete Own Listing (Ownership Verification)
**Endpoint:** `DELETE /api/listings/:listingId`

**Headers:**
```
Authorization: Bearer <token-from-creator>
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

**Test Deleting Other User's Listing (403):**

**Expected Response (403):**
```json
{
  "success": false,
  "message": "You can only delete your own listings"
}
```

---

### 7. Update User Profile (Self-Only)
**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer <valid-token>
```

**Request:**
```json
{
  "fullName": "Updated Name",
  "bio": "I'm a student at CIIT",
  "location": "Engineering Building",
  "avatar": "https://..."
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "uid": "unique-user-id",
    "fullName": "Updated Name",
    "bio": "I'm a student at CIIT"
  }
}
```

**Console Log:** ✅ `Profile updated for user: Updated Name`

**Test Without Token (401):**

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Authentication required to update profile"
}
```

---

### 8. Send Message (Authenticated)
**Endpoint:** `POST /api/messages`

**Headers:**
```
Authorization: Bearer <valid-token>
```

**Request:**
```json
{
  "recipientId": "other-user-id",
  "message": "Is this item still available?",
  "listingId": "listing-id"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "messageId": "msg-id",
    "conversationId": "user-id_other-user-id",
    "senderId": "unique-user-id",
    "message": "Is this item still available?"
  }
}
```

**Console Log:** ✅ `Message sent from Test User to Recipient Name`

**Test Without Token (401):**

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Authentication required to send messages"
}
```

---

### 9. Add Review (Authenticated, No Self-Review)
**Endpoint:** `POST /api/users/:userId/review`

**Headers:**
```
Authorization: Bearer <valid-token>
```

**Request:**
```json
{
  "rating": 5,
  "review": "Great seller! Fast response and honest descriptions."
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Review added successfully",
  "review": {
    "id": "review-id",
    "rating": 5,
    "review": "Great seller!..."
  }
}
```

**Console Log:** ✅ `Review submitted (5⭐) from user [your-id] to user [target-id]`

**Test Self-Review (400):**
Try to review your own user ID.

**Expected Response (400):**
```json
{
  "success": false,
  "message": "You cannot review yourself"
}
```

---

### 10. Delete Review (Ownership Verification)
**Endpoint:** `DELETE /api/users/reviews/:reviewId`

**Headers:**
```
Authorization: Bearer <token-from-reviewer>
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Console Log:** ✅ `Review deleted by user [your-id] (was 5⭐ review for user [target-id])`

**Test Deleting Other's Review (403):**
Try to delete a review you didn't write.

**Expected Response (403):**
```json
{
  "success": false,
  "message": "You can only delete your own reviews"
}
```

---

## Error Code Reference

| Status | Meaning | When It Happens |
|--------|---------|-----------------|
| **200** | ✅ Success | Request completed successfully |
| **201** | ✅ Created | New resource created |
| **400** | ❌ Bad Request | Missing/invalid fields, self-review attempted |
| **401** | ❌ Unauthorized | No token, invalid token, or expired token |
| **403** | ❌ Forbidden | Authenticated but trying unauthorized action (e.g., edit others' listing) |
| **404** | ❌ Not Found | Resource doesn't exist |
| **500** | ❌ Server Error | Internal server error |

---

## Token Validation Flow

When you make a request to a **protected route**:

```
Request with Authorization header
           ↓
         ↓↓↓ verifyToken middleware ↓↓↓
           ↓
   Extract token from "Bearer {token}"
           ↓
   Decode JWT with JWT_SECRET
           ↓
   Set req.userId and req.userEmail
           ↓
   Pass to route handler
           ↓
   Route handler uses req.userId
           ↓
   Database operation with userId verification
           ↓
   Return response
```

**If token is missing/invalid:** Request stops at middleware, returns 401 immediately.

---

## Headers Reference

### Get Protected Resource
```
GET /api/listings/featured
Authorization: Bearer token-here
```

### Create Protected Resource
```
POST /api/listings
Authorization: Bearer token-here
Content-Type: application/json

{
  "title": "Item",
  "price": 1000,
  ...
}
```

### Update Own Resource
```
PUT /api/listings/listing-id
Authorization: Bearer token-here
Content-Type: application/json

{
  "title": "Updated Item"
}
```

### Delete Own Resource
```
DELETE /api/listings/listing-id
Authorization: Bearer token-here
```

---

## Common Test Scenarios

### Scenario 1: Complete User Journey
```
1. Register: testuser@ciit.edu.ph / TestPassword123
2. Login: Get token
3. Create listing: POST /api/listings (with token)
4. Update profile: PUT /api/users/profile (with token)
5. Send message: POST /api/messages (with token)
6. Get user: GET /api/users/testuser (no token needed - public info)
```

### Scenario 2: Authorization Failures
```
1. Create listing A with User A's token ✅
2. Try to update listing A with User B's token ❌ (403 Forbidden)
3. Try to delete listing A with User B's token ❌ (403 Forbidden)
4. Try to delete User B's profile with User A's token ❌ (403 Forbidden)
```

### Scenario 3: Authentication Failures
```
1. Try to create listing without token ❌ (401 Unauthorized)
2. Try to update profile with invalid token ❌ (401 Unauthorized)
3. Try to send message with expired token ❌ (401 Unauthorized)
4. Try to add review without token ❌ (401 Unauthorized)
```

---

## Debugging Checklist

### If You Get 401 (Unauthorized)
- ✅ Is token present in Authorization header?
- ✅ Is token format correct? (`Bearer {token}`, not just `{token}`)
- ✅ Has token expired? (7-day expiry)
- ✅ Is JWT_SECRET same in login and verification?

### If You Get 403 (Forbidden)
- ✅ Are you trying to edit/delete your own resource?
- ✅ Is req.userId matching the resource owner?
- ✅ Are you trying to review your own profile? (not allowed)

### If You Get 400 (Bad Request)
- ✅ Are all required fields present?
- ✅ Are field values valid? (e.g., rating 1-5, price > 0)
- ✅ Is email a CIIT email? (@ciit.edu.ph)
- ✅ Is password 6+ characters?

### If You Get 404 (Not Found)
- ✅ Does the resource exist?
- ✅ Is the ID correct?
- ✅ Did you use correct endpoint?

---

## Expected Console Logs

When everything is working correctly, you should see logs like:

```
✅ User registered: Test User (testuser@ciit.edu.ph)
✅ User logged in: Test User (testuser@ciit.edu.ph)
✅ Listing created by Test User: "Used Laptop" (ID: abc123)
✅ Profile updated for user: Updated Name
✅ Message sent from Test User to Recipient Name
✅ Review submitted (5⭐) from user [id1] to user [id2]
✅ Review deleted by user [id1] (was 5⭐ review for user [id2])
```

---

## Implementation Details

### Protected Routes
All protected routes require valid JWT token in `Authorization: Bearer {token}` header:
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing (owner only)
- `DELETE /api/listings/:id` - Delete listing (owner only)
- `PUT /api/users/profile` - Update profile (self only)
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:conversationId` - Get messages (member only)
- `POST /api/users/:userId/review` - Add review
- `DELETE /api/users/reviews/:reviewId` - Delete review (reviewer only)

### Public Routes
These routes DON'T require authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/listings` - List all listings
- `GET /api/listings/featured` - Featured listings
- `GET /api/listings/:id` - Get listing
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/listings` - Get user's listings
- `GET /api/users/:userId/rating` - Get user's rating/reviews
- `GET /api/users/:userId/reviews` - Get user's reviews

---

## Next Steps

1. **Test Registration & Login Flow**: Verify tokens are issued correctly
2. **Test Protected Routes**: Ensure they require tokens
3. **Test Authorization**: Verify ownership checks work
4. **Test Error Cases**: Verify correct status codes returned
5. **Monitor Console Logs**: Confirm success messages appear on backend
6. **Integration Testing**: Test full user workflows end-to-end

