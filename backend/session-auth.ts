import { createHash, randomBytes } from 'node:crypto';

export type Role = 'investor' | 'admin';

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

export type Session = {
  id: string;
  user: AuthUser;
  expiresAt: number;
};

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const sessions = new Map<string, Session>();

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const digest = createHash('sha256').update(`${salt}:${password}`).digest('hex');
  return { salt, digest };
}

export function verifyPassword(password: string, salt: string, digest: string) {
  return hashPassword(password, salt).digest === digest;
}

export function createSession(user: AuthUser) {
  const id = randomBytes(32).toString('hex');
  const session = { id, user, expiresAt: Date.now() + SESSION_TTL_MS };
  sessions.set(id, session);
  return session;
}

export function getSession(id: string | undefined) {
  if (!id) return null;
  const session = sessions.get(id);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(id);
    return null;
  }
  return session;
}

export function destroySession(id: string | undefined) {
  if (id) sessions.delete(id);
}

export function requireRole(sessionId: string | undefined, role: Role) {
  const session = getSession(sessionId);
  if (!session || session.user.role !== role) throw new Error('Unauthorized');
  return session.user;
}

/**
 * Production note: replace the in-memory session store with a persistent,
 * secure session store/database and use a memory-hard password hash such as
 * Argon2id or bcrypt before handling real accounts.
 */
