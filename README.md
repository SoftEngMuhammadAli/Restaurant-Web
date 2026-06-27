# Velora Kitchen Restaurant App

A single-restaurant MERN application for online ordering, reservations, customer accounts, staff operations, kitchen display, tables, and basic analytics.

This is **not a SaaS app**. It is designed for one restaurant business.

## What Is Included

- Public restaurant website
- Menu browsing and cart
- Customer registration/login
- Checkout and order tracking
- Table reservations
- Customer profile and saved addresses
- Staff dashboard
- Order management
- Kitchen display
- Table status management
- Customer list
- Seed data for one restaurant

## Tech Stack

- Frontend: React 19, Vite, React Router, Redux Toolkit, RTK Query, Tailwind CSS, Recharts, Socket.io Client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io, JWT, Bcrypt, Joi, Winston, Helmet, CORS, Cookie Parser
- Tooling: Docker, Jest, Supertest, ESLint, Prettier

## Project Structure

```text
server/
  src/
    config/        App and restaurant config
    constants/     Roles, order statuses, table statuses
    controllers/   HTTP controllers
    middlewares/   Auth, validation, error handling
    models/        Mongoose models
    routes/        API routes
    seeders/       Demo seed data
    services/      Business logic
    sockets/       Socket.io events
    utils/         Helpers
    validators/    Joi schemas

client/
  src/
    api/           RTK Query API
    components/    Reusable UI
    features/      Auth/cart Redux slices
    layouts/       Public and staff layouts
    pages/         Public, customer, and staff pages
    routes/        React Router setup
    services/      Socket client
    store/         Redux store
```

## API Base

```text
http://localhost:8000/api
```

Main API groups:

```text
/auth
/menu
/orders
/restaurant
```

## Demo Accounts

Run the seeder first:

```bash
npm run seed
```

Then use:

```text
Admin:    admin@restaurant.com / Password123!
Manager:  manager@restaurant.com / Password123!
Chef:     chef@restaurant.com / Password123!
Waiter:   waiter@restaurant.com / Password123!
Cashier:  cashier@restaurant.com / Password123!
Customer: customer@example.com / Password123!
```

## Setup

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

## Frontend Routes

Public:

```text
/
/menu
/cart
/reserve
/login
/register
```

Customer:

```text
/checkout
/profile
/orders
/orders/:id
```

Staff:

```text
/staff
/staff/orders
/staff/kitchen
/staff/pos
/staff/tables
/staff/customers
/staff/reservations
/staff/analytics
```

## Scripts

```bash
npm run dev       # server + client
npm run seed      # seed demo restaurant data
npm run test      # server tests
npm run lint      # server and client lint
npm run build     # client production build
```

## Verification

Last verified with:

```bash
npm run lint -w server
npm run test -w server
npm run lint -w client
npm run build -w client
```
