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
/
/menu
/orders
/tables
/reservations
/customers
/analytics
/settings
/pos
/kitchen
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
