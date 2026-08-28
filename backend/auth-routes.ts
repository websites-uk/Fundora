import { db } from './db';
import { createSession, destroySession, getSession, hashPassword, verifyPassword, type Role } from './session-auth';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function registerInvestor(email: string, password: string) {
  const normalized = normalizeEmail(email);
  if (!/^\S+@\S+\.\S+$/.test(normalized)) throw new Error('Enter a valid email address.');
  if (password.length < 12) throw new Error('Password must be at least 12 characters.');
  const existing = await db.query('select 1 from users where email=$1', [normalized]);
  if (existing.rowCount) throw new Error('Account already exists.');
  const result = await db.query('insert into users (email,password_hash,role) values ($1,$2,$3) returning id,email,role', [normalized, hashPassword(password), 'investor']);
  return result.rows[0];
}

export async function login(email: string, password: string, role: Role) {
  const normalized = normalizeEmail(email);
  const result = await db.query('select id,email,role,password_hash from users where email=$1 and role=$2', [normalized, role]);
  const user = result.rows[0];
  if (!user || !verifyPassword(password, user.password_hash)) throw new Error('Invalid credentials.');
  return createSession({ id: user.id, email: user.email, role: user.role });
}

export async function logout(sessionId?: string) {
  await destroySession(sessionId);
}

export async function currentUser(sessionId?: string) {
  return (await getSession(sessionId))?.user ?? null;
}

export async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required to bootstrap the admin account.');
  if (password.length < 16) throw new Error('ADMIN_PASSWORD must be at least 16 characters.');
  const result = await db.query('select id from users where email=$1', [email]);
  if (result.rowCount) {
    await db.query('update users set role=$1 where email=$2', ['admin', email]);
    return;
  }
  await db.query('insert into users (email,password_hash,role) values ($1,$2,$3)', [email, hashPassword(password), 'admin']);
}
