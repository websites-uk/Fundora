import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { db } from './db';

export type Role = 'investor' | 'admin';
export type AuthUser = { id: string; email: string; role: Role };
export type Session = { id: string; user: AuthUser; expiresAt: Date };

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;

export function hashPassword(password: string): string {
  if (password.length < 12) throw new Error('Password must be at least 12 characters.');
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('base64')}$${key.toString('base64')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, salt64, key64] = parts;
  const expected = Buffer.from(key64, 'base64');
  const actual = scryptSync(password, Buffer.from(salt64, 'base64'), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function createSession(user: AuthUser): Promise<Session> {
  const id = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.query('insert into sessions (id, user_id, expires_at) values ($1, $2, $3)', [id, user.id, expiresAt]);
  return { id, user, expiresAt };
}

export async function getSession(id?: string): Promise<Session | null> {
  if (!id) return null;
  const result = await db.query(`select s.id, s.expires_at, u.id as user_id, u.email, u.role from sessions s join users u on u.id=s.user_id where s.id=$1 and s.expires_at > now()`, [id]);
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return { id: row.id, expiresAt: new Date(row.expires_at), user: { id: row.user_id, email: row.email, role: row.role } };
}

export async function destroySession(id?: string) {
  if (id) await db.query('delete from sessions where id=$1', [id]);
}

export async function requireRole(sessionId: string | undefined, role: Role) {
  const session = await getSession(sessionId);
  if (!session || session.user.role !== role) throw new Error('Unauthorized');
  return session.user;
}
