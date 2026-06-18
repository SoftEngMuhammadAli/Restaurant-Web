# Restaurant SaaS API Usage Guide

This guide explains how to use the API and what happens behind each endpoint. Swagger UI is available at:

```text
http://localhost:5000/api/docs
```

The raw OpenAPI JSON is available at:

```text
http://localhost:5000/api/docs.json
```

## Base URL

```text
http://localhost:5000/api/v1
```

## Response Format

Successful responses use this envelope:

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "meta": null
}
```

Paginated list responses include `meta`:

```json
{
  "success": true,
  "message": "Order list",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}
```

Error responses use this envelope:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": ["\"email\" must be a valid email"],
  "stack": "Only visible outside production"
}
```

## Authentication

The app uses two tokens:

- Access token: short-lived JWT used in the `Authorization` header.
- Refresh token: longer-lived JWT stored as an HTTP-only cookie named `refreshToken`.

Use this header for protected endpoints:

```text
Authorization: Bearer <accessToken>
```

### Register

```http
POST /auth/register
```

Creates a user. If the role is `OWNER`, it also creates a restaurant workspace.

```json
{
  "name": "Demo Owner",
  "email": "owner@demo.com",
  "password": "Password123!",
  "restaurantName": "Demo Bistro",
  "role": "OWNER"
}
```

What happens:

- Checks that the email is not already used.
- Finds the selected role.
- Hashes the password.
- Creates the user.
- Creates a restaurant for owners.
- Creates an email verification token.
- Sends verification email if SMTP is configured.
- Sets an HTTP-only refresh token cookie.
- Returns an access token and user object.

### Login

```http
POST /auth/login
```

```json
{
  "email": "owner@demo.com",
  "password": "Password123!"
}
```

What happens:

- Finds the user by email.
- Compares password with bcrypt.
- Updates `lastLoginAt`.
- Stores a hashed refresh token.
- Sets the refresh token cookie.
- Returns an access token.

### Refresh Token

```http
POST /auth/refresh
```

Usually the browser sends the HTTP-only cookie automatically. You can also send:

```json
{
  "refreshToken": "<refreshToken>"
}
```

What happens:

- Verifies the refresh token.
- Compares it to the hashed token stored on the user.
- Rotates the refresh token.
- Returns a new access token.

### Logout

```http
POST /auth/logout
```

Requires bearer token.

What happens:

- Clears the stored refresh token hash.
- Clears the refresh cookie.

## Roles

Supported roles:

```text
SUPER_ADMIN
OWNER
MANAGER
WAITER
CHEF
CASHIER
CUSTOMER
```

Most restaurant data is scoped by `req.user.restaurant`. A user only sees records from their restaurant unless the service explicitly disables restaurant scoping.

## CRUD Pattern

Most resources follow the same route shape:

```text
GET    /resource
POST   /resource
GET    /resource/:id
PUT    /resource/:id
DELETE /resource/:id
```

List query parameters:

```text
page=1
limit=20
search=burger
sort=-createdAt
```

Delete endpoints perform soft delete by setting `deletedAt`, so documents remain in MongoDB.

## Resources

### Restaurants

```text
/restaurants
```

Super admin only. Used for restaurant workspaces and branches.

### Roles

```text
/roles
```

Super admin only. Used for RBAC role records and permissions.

### Categories

```text
/categories
```

Used to group menu items.

### Menu Items

```text
/menu-items
```

Used for sellable products. A menu item belongs to a category and may reference variants and addons.

### Addons

```text
/addons
```

Used for optional item additions such as sauces, toppings, or extras.

### Variants

```text
/variants
```

Used for choices such as size, portion, or preparation style.

### Tables

```text
/tables
```

Used for dining room floor management.

Special action:

```http
PATCH /tables/:id/status
```

Allowed statuses:

```text
AVAILABLE
OCCUPIED
RESERVED
MAINTENANCE
```

What happens:

- Updates table status.
- Emits `tables:update` to the restaurant socket room.

### Reservations

```text
/reservations
```

Used for guest bookings.

Reservation statuses:

```text
PENDING
CONFIRMED
SEATED
COMPLETED
CANCELLED
NO_SHOW
```

### Customers

```text
/customers
```

Used for restaurant customer records. If role is omitted while creating a customer, the backend uses the `CUSTOMER` role.

### Reviews

```text
/reviews
```

Used for customer ratings and owner responses.

### Notifications

```text
/notifications
```

Used for notification records. Realtime delivery uses the socket event `notifications:new`.

## Orders

### List Orders

```http
GET /orders
```

Optional filter:

```text
?status=PREPARING
```

### Create Order

```http
POST /orders
```

```json
{
  "type": "DINE_IN",
  "table": "66b7f8f2c9a9f3b7a1d2e4c5",
  "items": [
    {
      "menuItem": "66b7f8f2c9a9f3b7a1d2e4c5",
      "quantity": 2,
      "notes": "No onions"
    }
  ],
  "taxTotal": 2.55,
  "discountTotal": 0,
  "serviceCharge": 1.5
}
```

What happens:

- Loads each menu item from the authenticated restaurant.
- Stores item name and price snapshots on the order.
- Calculates subtotal and grand total.
- Creates an order number.
- Emits `orders:new`.
- Emits `kitchen:new`.

### Update Order Status

```http
PATCH /orders/:id/status
```

Allowed statuses:

```text
PENDING
CONFIRMED
PREPARING
READY
OUT_FOR_DELIVERY
DELIVERED
COMPLETED
CANCELLED
```

What happens:

- Updates the order status.
- Emits `orders:update`.
- Emits `kitchen:update`.

## Payments

```http
POST /payments
```

```json
{
  "order": "66b7f8f2c9a9f3b7a1d2e4c5",
  "provider": "STRIPE",
  "amount": 34.05,
  "currency": "USD"
}
```

Supported providers:

```text
STRIPE
PAYPAL
JAZZCASH
EASYPAISA
CASH
```

What happens:

- Finds the order in the current restaurant.
- Creates a payment.
- Calls the selected payment strategy provider.
- Creates a transaction record.
- Updates order payment status when paid or authorized.

The provider classes are integration-ready stubs. Replace their internals with real provider SDK calls before production payments.

## Analytics

```http
GET /analytics/dashboard
```

Returns:

- Today revenue
- Today order count
- Upcoming reservation count
- Active table count
- Top selling items
- Chart data

## Uploads

```http
POST /uploads/images
```

Content type:

```text
multipart/form-data
```

Field:

```text
image
```

What happens:

- Validates that the file is an image.
- Uploads to Cloudinary.
- Stores under a restaurant/user folder.
- Returns `url` and `publicId`.

Cloudinary must be configured in `.env`.

## Realtime Socket Events

Socket server:

```text
http://localhost:5000
```

Connect with:

```js
io('http://localhost:5000', {
  auth: { token: accessToken },
  transports: ['websocket']
});
```

Current events:

```text
orders:new
orders:update
kitchen:new
kitchen:update
tables:update
notifications:new
```

The backend joins authenticated users to:

```text
restaurant:<restaurantId>
user:<userId>
```

## Recommended API Workflow

1. Seed the database.
2. Login with the demo owner.
3. Copy the access token.
4. Authorize Swagger with `Bearer <accessToken>`.
5. Create categories.
6. Create addons and variants.
7. Create menu items.
8. Create tables.
9. Create reservations or orders.
10. Update order/table statuses and watch socket events.
11. Create payments for completed orders.

## Demo Credentials

```text
Email: owner@demo.com
Password: Password123!
```
