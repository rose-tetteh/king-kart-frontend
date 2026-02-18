'use client';

import React from 'react';
import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navLinks, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-[var(--color-kk-navy)] border-t border-[var(--color-kk-gold)]">
      <nav className="flex flex-col space-y-4 py-4 px-4">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-white hover:text-[var(--color-kk-gold)] transition-colors duration-300 font-medium py-2"
            onClick={onClose}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
