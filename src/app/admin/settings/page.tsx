'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAdminUser } from '@/lib/adminAuth';

const settingsSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessEmail: z.string().email('Valid email is required'),
  businessPhone: z.string().min(1, 'Phone number is required'),
  businessAddress: z.string().min(1, 'Address is required'),
  currency: z.string().min(1, 'Currency is required'),
  taxRate: z.number().min(0).max(100),
  enableNotifications: z.boolean(),
  enableAutoConfirm: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const STORAGE_KEY = 'kingkart_settings';

const defaultSettings: SettingsFormData = {
  businessName: 'King Kart Clothing',
  businessEmail: 'info@kingkart.com',
  businessPhone: '+233 XX XXX XXXX',
  businessAddress: 'Accra, Ghana',
  currency: 'GHS',
  taxRate: 0,
  enableNotifications: true,
  enableAutoConfirm: false,
};

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const adminUser = getAdminUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        reset(settings);
      } catch {
        reset(defaultSettings);
      }
    }
  }, [reset]);

  const onSubmit = (data: SettingsFormData) => {
    setIsSaving(true);
    setSuccessMessage('');

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 500);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-kk-navy)]">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your business settings and preferences</p>
      </div>

      <div className="max-w-3xl">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[var(--color-kk-navy)] mb-6">Business Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Business Name
                </label>
                <input
                  {...register('businessName')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Business Email
                </label>
                <input
                  {...register('businessEmail')}
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.businessEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.businessEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Business Phone
                </label>
                <input
                  {...register('businessPhone')}
                  type="tel"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.businessPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.businessPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Business Address
                </label>
                <textarea
                  {...register('businessAddress')}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.businessAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.businessAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessAddress.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[var(--color-kk-navy)] mb-6">Financial Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Currency
                </label>
                <select
                  {...register('currency')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)]"
                >
                  <option value="GHS">GHS (₵)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Tax Rate (%)
                </label>
                <input
                  {...register('taxRate', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.taxRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.taxRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxRate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[var(--color-kk-navy)] mb-6">System Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[var(--color-kk-navy)]">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive email notifications for new orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    {...register('enableNotifications')}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-kk-gold)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-kk-gold)]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[var(--color-kk-navy)]">Auto-confirm Orders</p>
                  <p className="text-sm text-gray-600">Automatically confirm new orders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    {...register('enableAutoConfirm')}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-kk-gold)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-kk-gold)]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[var(--color-kk-navy)] mb-6">Admin Profile</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Name</span>
                <span className="font-semibold text-[var(--color-kk-navy)]">
                  {adminUser?.firstName || 'Admin'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Email</span>
                <span className="font-semibold text-[var(--color-kk-navy)]">
                  {adminUser?.email || 'admin@kingkart.com'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Role</span>
                <span className="px-3 py-1 bg-[var(--color-kk-gold)]/20 text-[var(--color-kk-navy)] text-xs font-medium rounded-full">
                  {adminUser?.role || 'ADMIN'}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-[var(--color-kk-navy)] text-[var(--color-kk-gold)] font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
