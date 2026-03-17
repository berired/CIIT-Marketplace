# Authentication & Protected Routes - Quick Test Checklist

Use this checklist to verify that authentication and all protected routes are working correctly.

---

## ✅ Test 1: User Registration

**Goal:** Verify user can register and receive JWT token

```bash
# Request
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "testuser1@ciit.edu.ph",
  "password": "TestPassword123",
  "fullName": "Test User One"
}
```

**Expected Result:**
- [ ] Status: 201
- [ ] Response includes `token` (JWT)
- [ ] Response includes `user` with uid, email, fullName
- [ ] Console shows: `✅ User registered: Test User One`
- [ ] User profile created in Firestore `users` collection

**Save this for next test:** 
```
TOKEN_1= [copy the token from response]
USER_ID_1= [copy the uid from response]
```

---

## ✅ Test 2: User Login

**Goal:** Verify login works and returns token

```bash
# Request
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "testuser1@ciit.edu.ph",
  "password": "TestPassword123"
}
```

**Expected Result:**
- [ ] Status: 200
- [ ] Response includes `token` (JWT)
- [ ] Response includes `user` with uid, email, isAdmin
- [ ] Console shows: `✅ User logged in: Test User One`
- [ ] Token is same format as registration ✓

**Test with wrong password:**
```bash
POST http://localhost:5000/api/auth/login
{
  "email": "testuser1@ciit.edu.ph",
  "password": "WrongPassword"
}
```

- [ ] Status: 401
- [ ] Message: "Invalid email or password"

---

## ✅ Test 3: Get Current User (Token Validation)

**Goal:** Verify token works for protected routes

```bash
# Request
GET http://localhost:5000/api/auth/me
Authorization: Bearer [TOKEN_1]
```

**Expected Result:**
- [ ] Status: 200
- [ ] Response includes current user data
- [ ] req.userId is correctly extracted from token ✓

**Test with invalid token:**
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer invalid-token-xyz
```

- [ ] Status: 401
- [ ] Message: "Invalid or expired token"

**Test without token:**
```bash
GET http://localhost:5000/api/auth/me
# (no Authorization header)
```

- [ ] Status: 401
- [ ] Message: "No token provided. Please authenticate."

---

## ✅ Test 4: Create Listing (Protected Route)

**Goal:** Verify authenticated user can create listing

```bash
# Request
POST http://localhost:5000/api/listings
Authorization: Bearer [TOKEN_1]
Content-Type: application/json

{
  "title": "Used Laptop Computer",
  "price": 15000,
  "category": "electronics",
  "condition": "good",
  "description": "Dell laptop in excellent condition. 8GB RAM, 256GB SSD. Works perfectly.",
  "image": "https://example.com/laptop.jpg"
}
```

**Expected Result:**
- [ ] Status: 201
- [ ] Response includes listing with id, title, price
- [ ] Listing.sellerId = [USER_ID_1] ✓
- [ ] Console shows: `✅ Listing created by Test User One: "Used Laptop Computer"`
- [ ] Listing stored in Firestore `listings` collection

**Save for later:**
```
LISTING_ID_1= [copy the id from response]
```

**Test without token:**
```bash
POST http://localhost:5000/api/listings
Content-Type: application/json
# (no Authorization header)

{ same body }
```

- [ ] Status: 401
- [ ] Message: "Authentication required to create listing"

**Test with invalid data:**
```bash
POST http://localhost:5000/api/listings
Authorization: Bearer [TOKEN_1]

{
  "title": "L",  # Too short
  "price": -5,   # Negative price
  "category": "invalid-category",
  "condition": "new",
  "description": "Short"  # Too short
}
```

- [ ] Status: 400
- [ ] Returns appropriate validation error messages

---

## ✅ Test 5: Update Own Listing (Ownership Check)

**Goal:** Verify user can update their own listing

```bash
# Request
PUT http://localhost:5000/api/listings/[LISTING_ID_1]
Authorization: Bearer [TOKEN_1]
Content-Type: application/json

{
  "title": "Used Laptop Computer - Price Reduced!",
  "price": 12000
}
```

**Expected Result:**
- [ ] Status: 200
- [ ] Listing updated in Firestore ✓
- [ ] Listing title and price changed ✓

---

## ✅ Test 6: Try Updating Someone Else's Listing (Authorization Check)

**Goal:** Verify user CANNOT update another user's listing

First, create another user:
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "testuser2@ciit.edu.ph",
  "password": "TestPassword456",
  "fullName": "Test User Two"
}
```

Save:
```
TOKEN_2= [copy token]
USER_ID_2= [copy uid]
```

Now try to update User 1's listing with User 2's token:
```bash
PUT http://localhost:5000/api/listings/[LISTING_ID_1]
Authorization: Bearer [TOKEN_2]
Content-Type: application/json

{
  "title": "Hacked!",
  "price": 1
}
```

**Expected Result:**
- [ ] Status: 403 (Forbidden)
- [ ] Message: "You can only edit your own listings"
- [ ] Original listing NOT modified ✓

---

## ✅ Test 7: Delete Own Listing

**Goal:** Verify user can delete their own listing

```bash
# Request
DELETE http://localhost:5000/api/listings/[LISTING_ID_1]
Authorization: Bearer [TOKEN_1]
```

**Expected Result:**
- [ ] Status: 200
- [ ] Message: "Listing deleted successfully"
- [ ] Listing removed from Firestore ✓

---

## ✅ Test 8: Update User Profile (Self-Only)

**Goal:** Verify authenticated user can update own profile

```bash
# Request
PUT http://localhost:5000/api/users/profile
Authorization: Bearer [TOKEN_1]
Content-Type: application/json

{
  "fullName": "Test User One Updated",
  "bio": "I'm a CIIT student buying and selling items",
  "location": "Engineering Hall",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Expected Result:**
- [ ] Status: 200
- [ ] Response includes updated user data
- [ ] Firebase Auth displayName also updated ✓
- [ ] Console shows: `✅ Profile updated for user: Test User One Updated`
- [ ] Firestore user document updated ✓

**Test without token:**
```bash
PUT http://localhost:5000/api/users/profile
Content-Type: application/json
# (no Authorization header)

{ same body }
```

- [ ] Status: 401
- [ ] Message: "Authentication required to update profile"

---

## ✅ Test 9: Send Message (Authenticated)

**Goal:** Verify authenticated user can send message

Create a listing with User 2 first:
```bash
POST http://localhost:5000/api/listings
Authorization: Bearer [TOKEN_2]
Content-Type: application/json

{
  "title": "Smartphone",
  "price": 8000,
  "category": "electronics",
  "condition": "like-new",
  "description": "iPhone 12 in mint condition. All accessories included."
}
```

Save:
```
LISTING_ID_2= [copy id]
```

Now send message from User 1 to User 2:
```bash
POST http://localhost:5000/api/messages
Authorization: Bearer [TOKEN_1]
Content-Type: application/json

{
  "recipientId": "[USER_ID_2]",
  "message": "Is this phone still available? Can you accept 7500?",
  "listingId": "[LISTING_ID_2]"
}
```

**Expected Result:**
- [ ] Status: 201
- [ ] Response includes messageId, conversationId
- [ ] Message stored in Firestore under conversation ✓
- [ ] Console shows: `✅ Message sent from Test User One to Test User Two`

**Test without token:**
```bash
POST http://localhost:5000/api/messages
Content-Type: application/json
# (no Authorization header)

{ same body }
```

- [ ] Status: 401
- [ ] Message: "Authentication required to send messages"

---

## ✅ Test 10: Add Review (No Self-Review)

**Goal:** Verify user can add review but not to self

User 1 reviews User 2:
```bash
POST http://localhost:5000/api/users/[USER_ID_2]/review
Authorization: Bearer [TOKEN_1]
Content-Type: application/json

{
  "rating": 5,
  "review": "Great communication and fast response. Item as described. Highly recommended!"
}
```

**Expected Result:**
- [ ] Status: 201
- [ ] Response includes review id and rating
- [ ] Review stored in Firestore ✓
- [ ] User 2's rating updated ✓
- [ ] Console shows: `✅ Review submitted (5⭐) from user [USER_ID_1] to user [USER_ID_2]`

**Test self-review (should fail):**
```bash
POST http://localhost:5000/api/users/[USER_ID_1]/review
Authorization: Bearer [TOKEN_1]
Content-Type: application/json

{
  "rating": 5,
  "review": "I am amazing!"
}
```

- [ ] Status: 400
- [ ] Message: "You cannot review yourself"

---

## ✅ Test 11: Get User Reviews

**Goal:** Verify can retrieve reviews for a user

```bash
GET http://localhost:5000/api/users/[USER_ID_2]/reviews
# No token needed for public info
```

**Expected Result:**
- [ ] Status: 200
- [ ] Response includes array of reviews
- [ ] Each review has reviewer info (fullName, avatar)
- [ ] Shows summary with averageRating

---

## ✅ Test 12: Delete Own Review (Ownership Check)

**Goal:** Verify user can delete own review

First, save the review ID from Test 10:
```
REVIEW_ID= [copy id from Test 10 response]
```

Delete review:
```bash
DELETE http://localhost:5000/api/users/reviews/[REVIEW_ID]
Authorization: Bearer [TOKEN_1]
```

**Expected Result:**
- [ ] Status: 200
- [ ] Message: "Review deleted successfully"
- [ ] Review removed from Firestore ✓
- [ ] User 2's rating recalculated ✓
- [ ] Console shows: `✅ Review deleted by user [USER_ID_1]`

**Test deleting someone else's review:**
Add another review from User 2 to User 1, then try to delete it with User 1's token:

```bash
POST http://localhost:5000/api/users/[USER_ID_1]/review
Authorization: Bearer [TOKEN_2]
Content-Type: application/json

{
  "rating": 4,
  "review": "Good seller!"
}
```

Save:
```
REVIEW_ID_2= [copy id]
```

Try User 1 deleting User 2's review:
```bash
DELETE http://localhost:5000/api/users/reviews/[REVIEW_ID_2]
Authorization: Bearer [TOKEN_1]
```

- [ ] Status: 403
- [ ] Message: "You can only delete your own reviews"
- [ ] Review NOT deleted ✓

---

## ✅ Test 13: Public Routes (No Token Needed)

**Goal:** Verify public routes don't require authentication

Get all listings:
```bash
GET http://localhost:5000/api/listings
```

- [ ] Status: 200
- [ ] Returns all active listings ✓

Get featured listings:
```bash
GET http://localhost:5000/api/listings/featured
```

- [ ] Status: 200
- [ ] Returns 8 most recent listings ✓

Get user profile:
```bash
GET http://localhost:5000/api/users/[USER_ID_1]
```

- [ ] Status: 200
- [ ] Returns public user info ✓

Get listing details:
```bash
GET http://localhost:5000/api/listings/[LISTING_ID_2]
```

- [ ] Status: 200
- [ ] Returns listing with views incremented ✓

---

## ✅ Summary Check

After completing all tests, verify:

### Authentication
- [ ] Registration creates user and issues token
- [ ] Login validates email/password and issues token
- [ ] Token validation works on protected routes
- [ ] Invalid token returns 401
- [ ] Missing token returns 401

### Protected Routes
- [ ] All protected routes require valid token
- [ ] Routes set req.userId from token
- [ ] Routes have authentication checks

### Authorization
- [ ] Users can only edit their own listings
- [ ] Users can only delete their own listings
- [ ] Users can only update their own profile
- [ ] Users can only delete their own reviews
- [ ] Users cannot review themselves
- [ ] 403 error returned for unauthorized operations

### Error Handling
- [ ] 400 for validation errors
- [ ] 401 for authentication errors
- [ ] 403 for authorization errors
- [ ] 404 for resources not found
- [ ] Console logs appear for successful operations

### Database
- [ ] Users created in Firestore
- [ ] Listings created with correct sellerId
- [ ] Messages stored in conversations
- [ ] Reviews stored with correct userIds
- [ ] Ratings updated in user profiles

---

## Troubleshooting

### If 401 Unauthorized

Check:
1. Is token in Authorization header? Format: `Bearer {token}`
2. Is token from same backend? (JWT_SECRET must match)
3. Has token expired? (7-day expiry)
4. No typos in token?

### If 403 Forbidden

Check:
1. Are you trying to modify your own resource?
2. Is req.userId correctly extracted?
3. Ownership check in route handler?

### If 400 Bad Request

Check:
1. All required fields present?
2. Field values valid? (price > 0, rating 1-5, etc.)
3. Email ends with @ciit.edu.ph?
4. Passwords 6+ characters?

### If No Console Logs

Check:
1. Is backend running? 
2. Are you hitting the endpoint?
3. Did request succeed (201/200 status)?
4. Check server.js for console middleware setup

---

## Test Summary

**Total Tests:** 13 major test scenarios
**Pass Criteria:** All checkboxes marked ✓

When all tests pass, your authentication system is secure and working correctly!

