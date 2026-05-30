# Airbnb API Clone

NestJS REST API for an Airbnb-style booking system (MySQL + Prisma DB First).

## Stack

NestJS · MySQL · Prisma · JWT (cookies) · Swagger · Cloudinary · Helmet

## Features

Auth · Users · Locations · Rooms · Bookings · Comments · Image upload

## Quick start

```bash
npm install
cp .env.example .env
# Edit .env (DATABASE_URL, JWT secrets, Cloudinary)

mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS airbnb_db;"
mysql -u root -p airbnb_db < database/init.sql

# Optional: demo data (dev only — truncates tables)
mysql -u root -p airbnb_db < database/seed.sql

npx prisma generate
npm run start:dev
```

- API: `http://localhost:3069/api`
- Swagger: `http://localhost:3069/api-docs`

## Database scripts

| File | Purpose |
|------|---------|
| `database/init.sql` | Create tables (fresh setup) |
| `database/seed.sql` | Sample data for local demo |
| `database/add-avatar-column.sql` | Add `avatar` column to existing DB (skip if you use current `init.sql`) |

**Seed logins** (after running `seed.sql`): password `123456`

| Email | Role |
|-------|------|
| `admin@airbnb.com` | ADMIN |
| `user1@airbnb.com` | USER |
| `user2@airbnb.com` | USER |
| `user3@airbnb.com` | USER |

## Environment

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `3069`) |
| `DATABASE_URL` | MySQL connection string |
| `ACCESS_TOKEN_SECRET` / `ACCESS_EXPIRES_IN` | Access JWT |
| `REFRESH_TOKEN_SECRET` / `REFRESH_EXPIRES_IN` | Refresh JWT |
| `CLOUDINARY_URL` / `CLOUDINARY_FOLDER` | Image upload |

## Prisma (DB First)

After MySQL schema changes:

```bash
npx prisma db pull
npx prisma generate
```

Do not use `prisma migrate`.

## Response shape

Success: `{ statusCode, message, content, dateTime }`  
Error: `{ statusCode, message, content: null, dateTime }`  

User responses never include `pass_word`.

## Main routes

| Prefix | Module |
|--------|--------|
| `/api/auth` | Sign up, sign in, refresh, profile |
| `/api/users` | Users CRUD, search, avatar upload |
| `/api/vi-tri` | Locations |
| `/api/phong-thue` | Rooms |
| `/api/dat-phong` | Bookings |
| `/api/binh-luan` | Comments |

Auth sets `accessToken` and `refreshToken` cookies on sign-in. Call `POST /api/auth/signin` first, then cookies are sent automatically on subsequent requests.

## Git workflow

- `main` — stable
- `develop` — integration
- `feature/*`, `fix/*`, `chore/*` — branch from `develop`, open PR → `develop` → `main`

## Scripts

`npm run start:dev` · `npm run build` · `npm run start:prod` · `npm run lint`
