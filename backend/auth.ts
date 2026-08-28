export type UserRole = 'investor' | 'admin';

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
};

export function requireRole(user: SessionUser | null | undefined, role: UserRole): SessionUser {
  if (!user || user.role !== role) throw new Error('Unauthorized');
  return user;
}
