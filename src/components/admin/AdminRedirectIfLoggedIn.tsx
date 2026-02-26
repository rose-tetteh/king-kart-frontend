'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminUser } from '@/lib/adminAuth';

export const AdminRedirectIfLoggedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const user = getAdminUser();
    if (user) {
      router.push('/admin/orders');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-kk-gold)]"></div>
      </div>
    );
  }

  return <>{children}</>;
};
