'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { clearAdminUser } from '@/lib/adminAuth';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAdminUser();
    router.push('/admin/login');
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="w-60 min-h-screen bg-[var(--color-kk-navy)] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-white/10">
        <div className="w-10 h-10 relative flex-shrink-0 bg-white rounded-full p-0.5">
          <Image src="/logo.jpeg" alt="King Kart" fill className="object-contain rounded-full" />
        </div>
        <div>
          <p className="text-[var(--color-kk-gold)] font-bold text-sm leading-tight">KING KART</p>
          <p className="text-white/60 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium transition-colors ${
            isActive('/admin/dashboard')
              ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>

        <Link
          href="/admin/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium transition-colors ${
            isActive('/admin/orders')
              ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Orders
        </Link>

        <Link
          href="/admin/products"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium transition-colors ${
            isActive('/admin/products')
              ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Products
        </Link>

        <Link
          href="/admin/customers"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium transition-colors ${
            isActive('/admin/customers')
              ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Customers
        </Link>

        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium transition-colors ${
            isActive('/admin/settings')
              ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-600/20 hover:text-red-400 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};
