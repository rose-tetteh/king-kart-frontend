'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerUser } from '@/lib/customerAuth';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  customerUser: CustomerUser | null;
  onSignOut: () => void;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  customerUser,
  onSignOut,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
      <nav className="flex flex-col py-4 px-4">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-gray-700 hover:text-[var(--color-kk-gold)] transition-colors duration-300 font-medium py-3 border-b border-gray-50"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}

        {/* Profile section */}
        <div className="mt-2 pt-2 flex flex-col gap-1">
          {customerUser ? (
            <>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-[var(--color-kk-gold)] transition-colors duration-300 font-medium py-3"
                onClick={onClose}
              >
                Your Profile
              </Link>
              <button
                onClick={() => { onSignOut(); onClose(); }}
                className="text-left text-red-500 hover:text-red-600 transition-colors duration-300 font-medium py-3"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-[var(--color-kk-gold)] transition-colors duration-300 font-medium py-3"
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-700 hover:text-[var(--color-kk-gold)] transition-colors duration-300 font-medium py-3"
                onClick={onClose}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
