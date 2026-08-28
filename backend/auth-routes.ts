import { createSession, destroySession, getSession, hashPassword, verifyPassword, type AuthUser, type Role } from './session-auth';

// Replace this development credential store with a database-backed users table.
// Do not commit real credentials or passwords to GitHub.
const users: Array<AuthUser & { salt: string; passwordDigest: string }> = [];

export function registerCredentialUser(email: string, password: string, role: Role = 'investor') {
  const normalized = email.trim().toLowerCase();
  if (!normalized || password.length < 12) throw new Error('Email and a 12+ character password are required.');
  if (users.some(u => u.email === normalized)) throw new Error('Account already exists.');
  const { salt, digest } = hashPassword(password);
  const user: AuthUser = { id: crypto.randomUUID(), email: normalized, role };
  users.push({ ...user, salt, passwordDigest: digest });
  return user;
}

export function login(email: string, password: string, role: Role) {
  const normalized = email.trim().toLowerCase();
  const user = users.find(u => u.email === normalized && u.role === role);
  if (!user || !verifyPassword(password, user.salt, user.passwordDigest)) throw new Error('Invalid credentials.');
  return createSession({ id: user.id, email: user.email, role: user.role });
}

export function logout(sessionId: string | undefined) {
  destroySession(sessionId);
}

export function currentUser(sessionId: string | undefined) {
  return getSession(sessionId)?.user ?? null;
}
