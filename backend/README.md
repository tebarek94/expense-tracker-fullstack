# Expense Tracker Backend API

Production-ready backend API for expense tracking using Node.js, Express, TypeScript, Prisma, and PostgreSQL (Neon).

## Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- JWT authentication (access + refresh token)
- Zod request validation
- MVC architecture

## Project Structure

```text
src/
├── config/
│   ├── db.ts
│   ├── env.ts
│   └── swagger.ts
├── controllers/
├── services/
├── routes/
├── middlewares/
├── utils/
├── validations/
├── types/
├── app.ts
└── server.ts
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

## Run Step-by-Step

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Expenses

- `POST /api/expenses`
- `GET /api/expenses`
- `GET /api/expenses/:id`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/expenses/summary`
- `GET /api/expenses/monthly`

### Others

- `GET /health`
- `GET /api/docs`

## Security

- Helmet headers
- Rate limiting
- Input sanitization middleware
- Password hashing with bcrypt
- HTTP-only refresh token cookie support
