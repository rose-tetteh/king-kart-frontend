// FRONTEND ONLY - REPLACE WITH BACKEND API
// TODO: Replace with POST /api/auth/login in backend integration story.

export interface AdminUser {
  email: string;
  firstName: string;
  role: 'ADMIN';
}

const STORAGE_KEY = 'kingkart_user';

// Hardcoded admin credentials for frontend testing only.
// TODO: Replace with backend API call in Story 5.1 backend integration
const ADMIN_CREDENTIALS = {
  email: 'admin@kingkart.com',
  password: 'Admin123!',
  firstName: 'Admin',
};

export const getAdminUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'ADMIN') return null;
    return parsed as AdminUser;
  } catch {
    return null;
  }
};

export const setAdminUser = (user: AdminUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearAdminUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const validateAdminCredentials = (
  email: string,
  password: string,
): AdminUser | null => {
  if (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    return {
      email: ADMIN_CREDENTIALS.email,
      firstName: ADMIN_CREDENTIALS.firstName,
      role: 'ADMIN',
    };
  }
  return null;
};
