'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminRedirectIfLoggedIn } from '@/components/admin/AdminRedirectIfLoggedIn';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = (data: AdminLoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');

    const success = login(data.email, data.password);
    if (success) {
      router.push('/admin/orders');
    } else {
      setErrorMessage('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 relative mx-auto mb-4 bg-white rounded-full p-1 shadow-md">
            <Image src="/logo.jpeg" alt="King Kart" fill className="object-contain rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-kk-navy)]">Admin Login</h1>
          <p className="text-gray-600 mt-1">King Kart Admin Panel</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2"
              >
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="admin@kingkart.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2"
              >
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[var(--color-kk-navy)] text-[var(--color-kk-gold)] font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[var(--color-kk-gold)] transition-colors"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <AdminRedirectIfLoggedIn>
      <AdminLoginForm />
    </AdminRedirectIfLoggedIn>
  );
}
