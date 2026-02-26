'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAdminUser } from '@/lib/adminAuth';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Don't guard the login page itself — AdminRedirectIfLoggedIn handles that
    if (pathname === '/admin/login') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAdmin(true);
      setChecking(false);
      return;
    }

    const user = getAdminUser();
    if (!user) {
      router.push('/admin/login');
    } else {
      setIsAdmin(true);
    }
    setChecking(false);
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-kk-gold)]"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
};
