'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AdminUser,
  getAdminUser,
  setAdminUser,
  clearAdminUser,
  validateAdminCredentials,
} from '@/lib/adminAuth';

export const useAdminAuth = () => {
  const router = useRouter();
  const [adminUser, setAdminUserState] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getAdminUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminUserState(user);
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = validateAdminCredentials(email, password);
    if (user) {
      setAdminUser(user);
      setAdminUserState(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAdminUser();
    setAdminUserState(null);
    router.push('/admin/login');
  };

  return { adminUser, login, logout, isLoading };
};
