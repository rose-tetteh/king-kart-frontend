'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders } from '@/lib/orderStorage';
import { Order, OrderStatus } from '@/types/cart';
import { StatusBadge } from '@/components/orders/StatusBadge';

type FilterTab = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

const ACTIVE_STATUSES: OrderStatus[] = ['RECEIVED', 'IN_PROGRESS', 'READY_FOR_DELIVERY'];

const formatDate = (isoString: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString));

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders(getOrders());
  }, []);

  const filtered = orders.filter((order) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') return ACTIVE_STATUSES.includes(order.status);
    if (activeFilter === 'COMPLETED') return order.status === 'COMPLETED';
    if (activeFilter === 'CANCELLED') return order.status === 'CANCELLED';
    return true;
  });

  const FILTER_TABS: { label: string; value: FilterTab }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[var(--color-kk-navy)] mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-16 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/services"
              className="inline-block px-6 py-3 bg-[var(--color-kk-navy)] text-[var(--color-kk-gold)] font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    activeFilter === tab.value
                      ? 'border-[var(--color-kk-gold)] text-[var(--color-kk-gold)] bg-yellow-50'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No orders in this category.
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((order) => {
                  const firstItem = order.items[0];
                  const extraCount = order.items.length - 1;

                  return (
                    <Link
                      key={order.orderNumber}
                      href={`/orders/${order.orderNumber}`}
                      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-bold text-[var(--color-kk-navy)] text-lg">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <p className="text-sm text-gray-700 mb-2">
                        {firstItem?.service.name ?? 'Custom Order'}
                        {extraCount > 0 && (
                          <span className="text-gray-400"> +{extraCount} more</span>
                        )}
                      </p>

                      <p className="text-base font-semibold text-[var(--color-kk-gold)]">
                        GH₵{order.total.toFixed(2)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
