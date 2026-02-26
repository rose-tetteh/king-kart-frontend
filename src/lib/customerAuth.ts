export interface CustomerUser {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'CUSTOMER';
}

const STORAGE_KEY = 'kingkart_user';

export const getCustomerUser = (): CustomerUser | null => {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'CUSTOMER') return null;
    return parsed as CustomerUser;
  } catch {
    return null;
  }
};

export const setCustomerUser = (user: CustomerUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const clearCustomerUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
