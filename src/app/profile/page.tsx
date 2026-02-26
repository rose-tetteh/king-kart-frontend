'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomerUser, getCustomerUser, setCustomerUser, clearCustomerUser } from '@/lib/customerAuth';
import { getOrders } from '@/lib/orderStorage';
import { getMeasurementProfiles } from '@/lib/measurementStorage';
import { useCart } from '@/contexts/CartContext';

function SummaryCard({
  title,
  count,
  subtext,
  linkLabel,
  linkHref,
}: {
  title: string;
  count: number;
  subtext: string;
  linkLabel: string;
  linkHref: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <p className="text-sm font-semibold text-gray-500 mb-3">{title}</p>
      <p className="text-4xl font-bold text-[var(--color-kk-navy)] mb-1">{count}</p>
      <p className="text-sm text-gray-500 mb-4">{subtext}</p>
      <Link
        href={linkHref}
        className="text-sm text-[var(--color-kk-gold)] hover:underline font-medium"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { itemCount } = useCart();

  const [user, setUser] = useState<CustomerUser | null>(null);
  const [measurementCount, setMeasurementCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [editErrors, setEditErrors] = useState<{ firstName?: string; lastName?: string; phone?: string }>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedUser = getCustomerUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(storedUser);
    if (storedUser) {
      setEditForm({
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
        phone: storedUser.phone,
      });
    }
    setMeasurementCount(getMeasurementProfiles().length);
    setOrderCount(getOrders().length);
  }, []);

  const handleEditSave = () => {
    const errors: typeof editErrors = {};
    if (!editForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!editForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (editForm.phone && !/^[+\d\s-]*$/.test(editForm.phone)) {
      errors.phone = 'Phone must contain digits, +, spaces, or hyphens only';
    }
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const updated: CustomerUser = {
      ...user!,
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim(),
      phone: editForm.phone.trim(),
    };
    setCustomerUser(updated);
    setUser(updated);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    clearCustomerUser();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[var(--color-kk-navy)] mb-8">My Profile</h1>

        {/* Guest Fallback */}
        {!user && (
          <div className="bg-white rounded-lg shadow p-8 mb-6 text-center">
            <p className="text-gray-600 mb-4">
              You&apos;re browsing as a guest. Log in to view your profile.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="px-6 py-3 bg-[var(--color-kk-navy)] text-[var(--color-kk-gold)] font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 border-2 border-[var(--color-kk-navy)] text-[var(--color-kk-navy)] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Profile Info — only when logged in */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--color-kk-navy)]">
                Hello, {user.firstName}!
              </h2>
              {!isEditing && (
                <button
                  onClick={() => {
                    setEditForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone });
                    setEditErrors({});
                    setIsEditing(true);
                  }}
                  className="text-sm text-[var(--color-kk-gold)] hover:underline font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">First Name:</span>{' '}
                  <span className="font-medium">{user.firstName}</span>
                </p>
                <p>
                  <span className="text-gray-500">Last Name:</span>{' '}
                  <span className="font-medium">{user.lastName || '—'}</span>
                </p>
                <p>
                  <span className="text-gray-500">Email:</span>{' '}
                  <span className="font-medium text-gray-700">{user.email}</span>
                </p>
                <p>
                  <span className="text-gray-500">Phone:</span>{' '}
                  <span className="font-medium">{user.phone || '—'}</span>
                </p>
                {saved && (
                  <p className="text-green-600 text-sm mt-2">Profile updated.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                        editErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{editErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                        editErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {editErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{editErrors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+233 XX XXX XXXX"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                      editErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {editErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{editErrors.phone}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleEditSave}
                    className="px-5 py-2 bg-[var(--color-kk-navy)] text-[var(--color-kk-gold)] text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setEditErrors({}); }}
                    className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Cards — visible to all (guest and logged in) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="My Measurements"
            count={measurementCount}
            subtext="saved profiles"
            linkLabel="View & Manage →"
            linkHref="/measurements/profiles"
          />
          <SummaryCard
            title="My Orders"
            count={orderCount}
            subtext="orders placed"
            linkLabel="View & Track →"
            linkHref="/orders"
          />
          <SummaryCard
            title="My Cart"
            count={itemCount}
            subtext="items in cart"
            linkLabel="Go to Cart →"
            linkHref="/cart"
          />
        </div>

        {/* Logout — only when logged in */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={handleLogout}
              className="px-6 py-3 border-2 border-red-400 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
