# Restaurant SaaS Platform

A JavaScript-only MERN SaaS foundation for multi-branch restaurant management, POS, kitchen display, reservations, analytics, and online ordering.

## Stack

- React 19, Vite, React Router, Redux Toolkit, RTK Query, React Hook Form, Zod, Tailwind CSS, Framer Motion, Recharts, Socket.io Client
- Node.js, Express, MongoDB, Mongoose, Socket.io, JWT refresh-token auth, Joi, Multer, Cloudinary, Nodemailer, Winston, Helmet, CORS, rate limiting, compression
- Docker, Swagger, Jest, Supertest, ESLint, Prettier

## Quick Start

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:5000/api/v1`

Swagger: `http://localhost:5000/api/docs`

## Demo Login

```text
owner@demo.com
Password123!
```

## Architecture

Backend modules follow `Route -> Controller -> Service -> Repository -> Database`. Controllers only parse HTTP input and return responses. Business behavior sits in services, data access in repositories.

Frontend modules are organized by feature with shared API, routing, layout, UI, hooks, and store layers.
