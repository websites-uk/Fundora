# Fundora backend

## Database

Fundora now uses PostgreSQL for persistent users, sessions, investment plans, investments, deposits, withdrawals and audit logs.

1. Provision a PostgreSQL database.
2. Apply `database/schema.sql`.
3. Set `DATABASE_URL` in the server environment.
4. Install dependencies and run `npm run server`.

## Authentication

- Investor registration creates an `investor` account in PostgreSQL.
- Admin login requires a database user whose role is `admin`.
- Passwords use Node's built-in scrypt KDF with a per-password random salt.
- Sessions are stored in PostgreSQL and expire after 8 hours.
- Session cookies are HTTP-only and SameSite=Lax; production adds Secure.
- Admin dashboard API access is protected server-side by the `admin` role.

## Initial admin

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (16+ characters) and temporarily set `BOOTSTRAP_ADMIN=true` in the server environment. Call `POST /api/admin/bootstrap` once, then immediately set `BOOTSTRAP_ADMIN=false` and remove the bootstrap credentials from the active environment where possible.

Never commit real passwords, database URLs, API keys, session secrets or banking credentials to GitHub.

## Important production controls

Before accepting public investment funds, add a persistent rate limiter, CSRF protection for cookie-authenticated state-changing requests, email verification, password reset, KYC/AML controls, authorization checks for every financial mutation, immutable audit trails, secure deployment secrets, backups, monitoring and the applicable Nigerian regulatory/legal controls.

This repository provides software infrastructure; it does not by itself establish that an investment business is licensed, compliant or safe to operate.
