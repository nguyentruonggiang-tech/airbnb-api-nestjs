# Airbnb API Clone

NestJS REST API for an Airbnb-style room booking system (MySQL + Prisma DB First).

## Stack

NestJS 11 · MySQL · Prisma 7 · JWT (HTTP cookies) · Swagger · Cloudinary · Helmet · bcrypt · class-validator

## Features

**Core:** Auth · Users · Locations · Rooms · Bookings · Comments · Image upload (Cloudinary)

**Extended (implemented):**

| Area | Endpoints / behavior |
|------|----------------------|
| Auth | Sign up, sign in, refresh token, **sign out**, get current user |
| Users | CRUD, search, avatar upload, **update own profile** (no `role` change) |
| Rooms | CRUD, search, upload image, **rooms by location**, **check availability by dates** |
| Bookings | CRUD, **my bookings (JWT)**, **block overlapping dates** on create/update |
| Comments | CRUD, pagination, comments by room, star rating 1–5 |

**Not in this release:** advanced room search, comment rating stats, admin dashboard stats.

## Quick start

```bash
npm install
cp .env.example .env
# Set DATABASE_URL, JWT secrets, Cloudinary

mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS airbnb_db;"
mysql -u root -p airbnb_db < database/init.sql

# Optional demo data (truncates tables)
mysql -u root -p airbnb_db < database/seed.sql

npx prisma generate
npm run start:dev
```

- API base: `http://localhost:3069/api`
- Swagger UI: `http://localhost:3069/api-docs` (browser tab title: **Airbnb API**)

## Database scripts

| File | Purpose |
|------|---------|
| `database/init.sql` | Create tables |
| `database/seed.sql` | Sample data |
| `database/add-avatar-column.sql` | Migration for old DBs only (included in current `init.sql`) |

**Seed accounts** (password `123456`):

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

```bash
npx prisma db pull   # after MySQL schema changes
npx prisma generate
```

Do not use `prisma migrate`.

## Authentication

- `POST /api/auth/signin` sets cookies `accessToken` and `refreshToken`.
- Protected routes read cookies automatically (enable cookies in Swagger / Postman).
- `POST /api/auth/signout` clears cookies.

## Response format

Success: `{ statusCode, message, content, dateTime }`  
Error: `{ statusCode, message, content: null, dateTime }`  

User responses never include `pass_word`.

## API overview

| Prefix | Highlights |
|--------|------------|
| `/api/auth` | signup, signin, refresh-token, signout, get-info |
| `/api/users` | CRUD, search, **PUT profile**, upload-avatar |
| `/api/vi-tri` | Locations CRUD, pagination, upload image |
| `/api/phong-thue` | Rooms CRUD, **lay-phong-theo-vi-tri/:maViTri**, **:id/kiem-tra-trong**, upload image |
| `/api/dat-phong` | Bookings CRUD, **GET cua-toi**, overlap validation (409) |
| `/api/binh-luan` | Comments CRUD, pagination, by room |

Full request/response details: **Swagger** at `/api-docs`.

## Git workflow

```
main      ← stable / submission
develop   ← integration
feature/* ← branch from develop → PR → develop → main
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server (watch) |
| `npm run build` | Production build |
| `npm run start:prod` | Run built app |
| `npm run lint` | ESLint |

## Project structure

```
src/
├── common/           guards, filters, interceptors, helpers
├── modules/          auth, users, locations, rooms, bookings, comments
└── modules-system/   prisma, token, cloudinary
database/             init.sql, seed.sql
prisma/               schema (db pull)
```
