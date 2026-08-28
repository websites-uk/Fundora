export type UserRole = 'investor' | 'admin';

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
};

/**
 * Authorization contract for the production backend.
 * Authentication/session verification must happen server-side.
 */
export function requireRole(user: SessionUser | null | undefined, role: UserRole): SessionUser {
  if (!user || user.role !== role) {
    throw new Error('Unauthorized');
  }
  return user;
}
