'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

// Admin layout covers the root layout's public Header and Footer via fixed positioning.
// Login page gets no sidebar; all other admin routes get the full dashboard layout.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AdminGuard>
      <div className="fixed inset-0 z-50 flex bg-gray-50">
        {!isLoginPage && <AdminSidebar />}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
