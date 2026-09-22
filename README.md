# Expense Management REST API

A RESTful Expense Management API built with **Node.js, Express.js, PostgreSQL, Prisma ORM, and JWT Authentication**.

## Live API

https://expense-management-backend-2war.onrender.com

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcryptjs
- Render

## Setup & Run

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd expense-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=expense_management

DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/expense_management"

JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1d"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Local API:

```text
http://localhost:5000
```

---

## Authentication

JWT authentication is implemented.

After login/register, use the returned token for protected routes:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## API Routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Check API health |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get authenticated user |
| POST | `/api/users` | Create a user |
| POST | `/api/expenses` | Add an expense |
| GET | `/api/expenses` | Get expenses with pagination and filters |
| GET | `/api/expenses/summary` | Get expense summary |
| GET | `/api/expenses/:id` | Get expense by ID |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

### Expense Filters

`GET /api/expenses` supports:

```text
?page=1&limit=10
?userId=1
?category=Food
?fromDate=2026-09-01&toDate=2026-09-30
```

Filters can also be combined.

### Protected Routes

The following routes require JWT authentication:

```text
GET    /api/auth/me
POST   /api/expenses
GET    /api/expenses
GET    /api/expenses/summary
GET    /api/expenses/:id
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

---

## Database

PostgreSQL is used as the database and Prisma ORM is used for database operations and migrations.

Database migration:

```bash
npx prisma migrate dev
```

Production migration:

```bash
npx prisma migrate deploy
```

---

## Deployment

The backend is deployed on Render.

**Live API:**

https://expense-management-backend-2war.onrender.com

**Health Check:**

https://expense-management-backend-2war.onrender.com/
