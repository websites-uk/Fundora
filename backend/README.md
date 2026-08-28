# Fundora backend

## Environment

Set `DATABASE_URL` in the server/deployment environment. Never commit database credentials, session secrets, admin passwords, API keys, or banking credentials to GitHub.

## Database

Apply `database/schema.sql` to a PostgreSQL database before starting the server.

## Production authentication

Use the database-backed `users` and `sessions` tables with secure, HTTP-only, SameSite cookies. Passwords must be stored using a memory-hard password hashing algorithm such as Argon2id or bcrypt. Add CSRF protection for cookie-authenticated state-changing requests, rate-limit login attempts, validate all inputs server-side, and audit privileged actions.

The included code is the database foundation; it is not a claim that the repository is production-ready for handling public investment funds.
