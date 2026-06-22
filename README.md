# Restaurant SaaS Platform

A JavaScript-only MERN SaaS foundation for a multi-branch restaurant management and online ordering business.

The project includes a production-shaped backend, a responsive SaaS frontend, JWT refresh-token authentication, RBAC, Socket.io realtime updates, Swagger docs, seed data, Docker setup, and representative CRUD modules for the core restaurant workflows.

## What This App Covers

- Restaurant and branch management
- Users, roles, permissions, and RBAC
- Menu categories, menu items, variants, and addons
- Tables and table status tracking
- Reservations
- Orders and kitchen display updates
- Payments using a strategy-provider structure
- Customers, reviews, notifications, coupons, addresses, and profiles at the model layer
- Dashboard and analytics foundation
- Customer storefront, cart, checkout, POS, and kitchen display UI

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod
- Axios
- Socket.io Client
- Tailwind CSS
- Shadcn-style UI primitives
- Framer Motion
- Recharts
- React Hot Toast

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT access tokens
- HTTP-only refresh tokens
- Bcrypt
- Joi
- Multer
- Cloudinary
- Nodemailer
- Winston
- Helmet
- CORS
- Rate limiting
- Compression
- Cookie Parser

**Infrastructure and Tooling**

- Docker
- Docker Compose
- Swagger
- Jest
- Supertest
- ESLint
- Prettier
- MongoDB Atlas-ready configuration
- Cloudinary-ready uploads

## Project Structure

```text
restaurant-saas-platform/
  backend/
    src/
      config/          App config, MongoDB connection, Cloudinary config
      constants/       Shared enums such as roles, order status, table status
      controllers/     Thin HTTP controllers
      docs/            Swagger configuration
      jobs/            Background job helpers
      middlewares/     Auth, RBAC, validation, rate limit, uploads, errors
      models/          Mongoose schemas and soft-delete plugin
      repositories/    Database access layer
      routes/          Express route definitions
      seeders/         Demo roles, owner, restaurant, menu, tables
      services/        Business logic
        payments/      Payment strategy providers
      sockets/         Socket.io setup and emit helpers
      utils/           Response helpers, logger, tokens, email, errors
      validators/      Joi request schemas
      app.js           Express app factory
      server.js        HTTP and Socket.io server startup
    tests/             Jest + Supertest tests
    Dockerfile
    package.json

  frontend/
    src/
      api/             Axios and RTK Query API setup
      app/             Demo UI data and app-level constants
      components/      Reusable UI primitives
        ui/
      features/        Feature modules and pages
      hooks/           Shared React hooks
      layouts/         Auth, dashboard, storefront layouts
      pages/           Customer storefront pages
      routes/          React Router setup and protected routes
      services/        Socket.io client service
      store/           Redux store setup
      utils/           Shared frontend utilities
      main.jsx         React entry point
      index.css        Tailwind and theme tokens
    Dockerfile
    nginx.conf
    package.json

  docker-compose.yml
  .env.example
  package.json
  README.md
```

## Architecture

The backend follows this flow:

```text
Route -> Controller -> Service -> Repository -> Database
```

**Routes**

Routes define the HTTP endpoints and attach middleware such as authentication, authorization, validation, and file upload handling.

Example:

```text
backend/src/routes/auth.routes.js
backend/src/routes/domain.routes.js
```

**Controllers**

Controllers are intentionally thin. They read request data, call a service, and return a response. They should not contain business logic.

Example:

```text
backend/src/controllers/AuthController.js
backend/src/controllers/OrderController.js
backend/src/controllers/TableController.js
```

**Services**

Services contain business rules. This is where order totals, payment provider selection, auth token behavior, realtime emits, and scoped resource access belong.

Example:

```text
backend/src/services/AuthService.js
backend/src/services/OrderService.js
backend/src/services/PaymentService.js
backend/src/services/TableService.js
```

**Repositories**

Repositories isolate direct database access. The shared `BaseRepository` provides common create, list, update, find, and soft-delete operations.

Example:

```text
backend/src/repositories/BaseRepository.js
backend/src/repositories/UserRepository.js
backend/src/repositories/domainRepositories.js
```

**Database**

Mongoose models define validation, indexes, relationships, timestamps, and soft delete support.

Example:

```text
backend/src/models/User.js
backend/src/models/Restaurant.js
backend/src/models/MenuItem.js
backend/src/models/Order.js
```

## Backend Modules

Implemented backend foundations include:

- Auth
- RBAC
- Restaurants
- Roles
- Users and customers
- Categories
- Menu items
- Addons
- Variants
- Tables
- Reservations
- Orders
- Payments
- Reviews
- Notifications
- Analytics dashboard
- Image upload endpoint

The model layer also includes:

- `Permission`
- `Transaction`
- `Coupon`
- `Address`
- `CustomerProfile`
- `OrderItem` embedded schema

## Frontend Modules

The frontend includes:

- Login
- Register
- Dashboard
- Menu management
- Orders
- Tables
- Reservations
- Customers
- Analytics
- Settings
- POS
- Kitchen display
- Customer storefront
- Cart
- Checkout
- Profile

The UI uses reusable primitives in `frontend/src/components/ui`, including:

- Button
- Input
- Select
- Card
- Badge
- Table
- Tabs
- Dialog
- Drawer
- Skeleton
- Empty state
- Theme toggle

## Auth Flow

The backend uses:

- Short-lived JWT access token
- HTTP-only refresh token cookie
- Bcrypt password hashing
- Refresh token hashing in the database
- Email verification token
- Forgot/reset password token
- Change password endpoint

Main endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/verify-email
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/change-password
```

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

RBAC middleware lives in:

```text
backend/src/middlewares/auth.middleware.js
```

Use `authenticate` to require a valid access token.

Use `authorizeRoles(...)` to restrict an endpoint to specific roles.

## Order Statuses

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

## Table Statuses

```text
AVAILABLE
OCCUPIED
RESERVED
MAINTENANCE
```

## Realtime Events

Socket.io is initialized in:

```text
backend/src/sockets/index.js
frontend/src/services/socket.js
```

The socket server authenticates clients using the access token and joins them to a restaurant room.

Current event names include:

```text
orders:new
orders:update
kitchen:new
kitchen:update
tables:update
notifications:new
```

The backend emits restaurant-scoped events with:

```js
emitRestaurantEvent(restaurantId, 'orders:new', order);
```

## Payment Strategy Pattern

Payment logic is organized around provider classes:

```text
backend/src/services/PaymentService.js
backend/src/services/payments/PaymentProvider.js
backend/src/services/payments/StripeProvider.js
backend/src/services/payments/PaypalProvider.js
backend/src/services/payments/JazzCashProvider.js
backend/src/services/payments/EasyPaisaProvider.js
```

`PaymentService` selects the correct provider based on the request payload:

```text
STRIPE
PAYPAL
JAZZCASH
EASYPAISA
CASH
```

The provider implementations are currently integration-ready stubs. Replace their internals with real SDK/API calls when connecting production payment accounts.

## Prerequisites

Install:

- Node.js 20 or newer
- npm
- MongoDB locally, MongoDB through Docker, or MongoDB Atlas

Optional:

- Docker Desktop
- Cloudinary account
- SMTP provider

## Environment Setup

Create your local environment file:

```bash
cp .env.example .env
```

Important variables:

```text
PORT=5000
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
MONGO_URI=mongodb://localhost:27017/restaurant_saas
JWT_ACCESS_SECRET=replace-with-a-long-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-refresh-secret
JWT_EMAIL_SECRET=replace-with-a-long-email-secret
```

For Docker Compose, this value is used inside the backend container:

```text
MONGO_URI=mongodb://mongo:27017/restaurant_saas
```

For MongoDB Atlas, set:

```text
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/restaurant_saas
```

## Install Dependencies

From the project root:

```bash
npm install
```

This installs dependencies for the root workspace, backend, and frontend.

## Seed Demo Data

Run:

```bash
npm run seed
```

The seeder creates:

- System roles
- Demo owner
- Demo restaurant
- Demo categories
- Demo menu items
- Demo tables

Demo login:

```text
Email: owner@demo.com
Password: Password123!
```

Additional seeded accounts:

```text
superadmin@demo.com / Password123!
manager@demo.com / Password123!
waiter@demo.com / Password123!
chef@demo.com / Password123!
cashier@demo.com / Password123!
ariana@example.com / Password123!
```

## Run Locally

Start backend and frontend together:

```bash
npm run dev
```

Then open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api/v1
Swagger:  http://localhost:5000/api/docs
Health:   http://localhost:5000/health
```

Run only the backend:

```bash
npm run dev -w backend
```

Run only the frontend:

```bash
npm run dev -w frontend
```

## Docker Usage

Create `.env` first:

```bash
cp .env.example .env
```

Start the full stack:

```bash
docker compose up --build
```

Services:

```text
MongoDB:  localhost:27017
Backend:  http://localhost:5000
Frontend: http://localhost:5173
```

Stop containers:

```bash
docker compose down
```

Remove the MongoDB volume too:

```bash
docker compose down -v
```

## Available Scripts

Root scripts:

```bash
npm run dev       # Run backend and frontend together
npm run build     # Build frontend
npm run start     # Start backend
npm run seed      # Seed backend demo data
npm run test      # Run backend tests
npm run lint      # Lint backend and frontend
npm run format    # Format all files with Prettier
```

Backend scripts:

```bash
npm run dev -w backend
npm run start -w backend
npm run seed -w backend
npm run test -w backend
npm run lint -w backend
```

Frontend scripts:

```bash
npm run dev -w frontend
npm run build -w frontend
npm run preview -w frontend
npm run lint -w frontend
```

## API Overview

Base URL:

```text
http://localhost:5000/api/v1
```

Common protected resources:

```text
/restaurants
/roles
/categories
/menu-items
/addons
/variants
/tables
/reservations
/orders
/payments
/customers
/reviews
/notifications
/analytics/dashboard
/uploads/images
```

Swagger docs:

```text
http://localhost:5000/api/docs
```

Raw OpenAPI JSON:

```text
http://localhost:5000/api/docs.json
```

Backend API usage guide:

```text
backend/src/docs/API_USAGE.md
```

## Frontend Routes

Public/auth routes:

```text
/login
/register
/store
/cart
/checkout
/profile
```

Protected dashboard routes:

```text
/app
/app/menu
/app/orders
/app/tables
/app/reservations
/app/customers
/app/analytics
/app/settings
/app/pos
/app/kitchen
```

Protected customer routes:

```text
/checkout
/account
/account/orders
/account/orders/:id
```

## How To Add A New Backend Module

Follow the existing architecture:

1. Add a Mongoose model in `backend/src/models`.
2. Add validation schemas in `backend/src/validators`.
3. Add a repository or use `BaseRepository`.
4. Add a service in `backend/src/services`.
5. Add a controller in `backend/src/controllers`.
6. Add routes in `backend/src/routes`.
7. Register routes in `backend/src/routes/index.js` or `domain.routes.js`.
8. Add tests in `backend/tests`.

Keep business logic in services, not controllers.

## How To Add A New Frontend Feature

Use this structure:

```text
frontend/src/features/my-feature/
  MyFeaturePage.jsx
  components/
  hooks/
```

Then:

1. Add API calls through `frontend/src/api/apiSlice.js`.
2. Add the route in `frontend/src/routes/AppRouter.jsx`.
3. Add navigation in `frontend/src/layouts/DashboardLayout.jsx` if needed.
4. Reuse UI primitives from `frontend/src/components/ui`.

## Testing

Backend tests use Jest and Supertest.

Run:

```bash
npm run test
```

Current test coverage includes an auth registration integration test using `mongodb-memory-server`.

## Linting And Formatting

Run lint checks:

```bash
npm run lint
```

Format files:

```bash
npm run format
```

## Production Notes

Before production deployment:

- Replace all JWT secrets with strong random values.
- Use MongoDB Atlas or a managed MongoDB service.
- Configure Cloudinary credentials for image uploads.
- Configure SMTP credentials for email verification and password resets.
- Replace payment provider stubs with real provider SDK/API integrations.
- Set `NODE_ENV=production`.
- Restrict CORS to your real frontend domain.
- Review rate limits for your expected traffic.
- Add CI/CD secrets through your deployment provider.
- Run `npm audit` and address dependency advisories according to your risk policy.

## Current Implementation Notes

This repository is a strong production-ready foundation, not a finished commercial SaaS product. The architecture, models, auth, RBAC, sockets, seeders, Docker setup, and UI shell are in place. Some provider integrations and advanced workflows are intentionally scaffolded so they can be connected to real accounts and business rules safely.

---

# USER GUIDE: How to Use as a Customer

This section explains how to use the Restaurant App as a customer to browse menus and place food orders.

## Getting Started

### 1. Access the Application

Open your browser and go to:

```text
http://localhost:5173
```

You'll land on the storefront page showing the restaurant menu.

### 2. Create a Customer Account

**Option A: Sign Up as a Customer**

1. Click the **"Order food"** link on the login page
2. Go to `/register/customer` or click the link from the register page
3. Fill in the registration form:
   - **Full Name**: Your name
   - **Email**: Your email address
   - **Phone**: Your phone number
   - **Password**: Create a strong password (min 8 characters)
   - **Confirm Password**: Re-enter your password
4. Click **"Create Account"**
5. You'll be automatically logged in and redirected to the storefront

**Option B: Login with Demo Account**

If demo data has been seeded, use:

```text
Email: owner@demo.com (or any demo customer account if created)
Password: Password123!
```

## Browsing and Ordering

### 1. Browse the Menu

On the storefront page, you can:

- **View all menu items** in a grid layout with images, descriptions, and prices
- **Filter by category** using the category buttons at the top
- **See item details** including name, description, category, and price
- **Track cart count** in the top-right corner showing how many items are in your cart

### 2. Add Items to Cart

1. Click the **"+ Add"** button on any menu item
2. You'll see a toast notification: `"[Item Name] added to cart!"`
3. The cart counter in the header will update
4. Add as many items as you want!

### 3. View Your Cart

Click the **"Cart"** button in the header (shows item count).

In the cart page, you can:

- **See all items** with their quantity and price
- **Adjust quantities** using the +/- buttons
- **Remove items** using the trash icon
- **View subtotal and delivery fee**
- **See the grand total**
- **Continue shopping** or **Proceed to Checkout**

### 4. Checkout

1. Click **"Proceed to Checkout"** in the cart
2. Fill in your delivery details:
   - **Full Name**: Your name (pre-filled if logged in)
   - **Email**: Your email (pre-filled if logged in)
   - **Phone Number**: Your contact number
   - **Address**: Street address
   - **City**: Your city
3. Select your preferences:
   - **Fulfillment Type**:
     - Delivery (food will be delivered to your address)
     - Pickup (collect from restaurant)
     - Dine In (eat at the restaurant)
   - **Payment Method**:
     - Cash on Delivery
     - Card Payment
     - EasyPaisa
   - **Special Instructions** (optional): Any special requests
4. Click **"Place Order"**
5. You'll see a success message and be redirected to order tracking

### 5. Track Your Order

After placing an order, you have two ways to track it:

**Option A: Automatic Redirect**

- You'll be automatically taken to the order detail page

**Option B: Orders Page**

- Click **"Orders"** in the navigation to see all your orders
- Click any order to see full details

**Order Status Timeline:**

- 🟡 **Pending** → Order received, waiting for confirmation
- 🔵 **Confirmed** → Restaurant confirmed your order
- 🟣 **Preparing** → Chef is preparing your food
- 🔵 **Ready** → Food is ready for delivery/pickup
- 🔷 **Out for Delivery** → On the way to you (if delivery)
- 🟢 **Delivered** → Order received
- 🟢 **Completed** → Order completed

### 6. View Your Profile

Click the **"Profile"** button in the header to:

- **See your personal information** (name, email, verification status)
- **View saved addresses** for quick checkout next time
- **Add new addresses** for different delivery locations
- **Change password** (coming soon)
- **Manage notification preferences** (coming soon)
- **Sign out** from your account

## Key Features Implemented

✅ **Customer Registration** - Easy sign-up process
✅ **Menu Browsing** - Filter by categories, view real menu items from backend
✅ **Shopping Cart** - Add/remove items, adjust quantities
✅ **Checkout** - Fill in delivery details and place orders
✅ **Order Tracking** - Real-time order status updates
✅ **Customer Profile** - Manage account and addresses
✅ **Authentication** - Secure login with JWT tokens
✅ **Responsive Design** - Works on mobile and desktop

## Payment Methods

The checkout currently supports these payment methods (configurable):

- **Cash on Delivery** - Pay when food arrives
- **Card Payment** - Credit/Debit card (stub implementation)
- **EasyPaisa** - Pakistani mobile payment (stub implementation)

_Note: Payment provider stubs are ready for real integration_

## Troubleshooting

### "No Items Available"

- Make sure the backend is running: `npm run dev -w backend`
- Check that demo data has been seeded: `npm run seed`

### "Cart is Empty"

- Add items from the storefront by clicking "+ Add" buttons

### "Login Failed"

- Verify your email and password
- Try the demo account: owner@demo.com / Password123!
- Ensure the backend is running

### Items Not Showing in Checkout

- The cart uses Redux state management - refresh if needed
- Make sure you added items before checkout

### Order Not Created

- Ensure all checkout form fields are filled
- Check that backend is processing orders
- Look at browser console for error messages

## Tips

- 💡 **Quick Reorder**: Check your order history to quickly re-order favorites
- 📱 **Mobile Friendly**: The app is fully responsive on mobile devices
- 🔔 **Get Notifications**: Enable browser notifications to track order updates
- 💾 **Save Addresses**: Add multiple addresses for faster checkout next time
- 🔐 **Security**: Your passwords are hashed and never stored in plain text

## API Endpoints Used (For Developers)

Customer-related API endpoints:

```text
POST   /auth/register              - Create customer account
POST   /auth/login                 - Log in to account
GET    /menu-items                 - Fetch all menu items
GET    /categories                 - Fetch categories
POST   /orders                     - Create new order
GET    /orders                     - Get your orders
GET    /orders/:id                 - Get order details
GET    /customers/me               - Get profile info
GET    /addresses                  - Get saved addresses
POST   /addresses                  - Add new address
```

All endpoints require authentication except `/auth/register`, `/auth/login`, and public menu endpoints.

## What's Next?

Future enhancements for the customer experience:

- ⏳ Real-time order notifications via Socket.io
- ⏳ Order reviews and ratings
- ⏳ Coupon and discount codes
- ⏳ Loyalty rewards program
- ⏳ Order scheduling for future delivery
- ⏳ Payment integration with Stripe/PayPal
- ⏳ Restaurant search and filtering
- ⏳ Favorites and saved items

---

**Happy ordering! 🍕**
