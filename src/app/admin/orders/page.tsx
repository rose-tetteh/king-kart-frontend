'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllOrders } from '@/lib/adminOrderStorage';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/types/cart';

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  RECEIVED: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  READY_FOR_DELIVERY: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
};

type FilterTab = 'ALL' | OrderStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Received', value: 'RECEIVED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Ready for Delivery', value: 'READY_FOR_DELIVERY' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const formatDate = (isoString: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString));

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders(getAllOrders());
  }, []);

  const filtered = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'ALL' || order.status === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8">
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-6">Orders</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] text-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
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

      {/* Orders Table */}
      {filtered.length === 0 ? (
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500">
            {orders.length === 0
              ? 'No orders yet. Orders placed by customers will appear here.'
              : 'No orders match the current filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Order #</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Customer</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Payment</th>
                <th className="text-right px-6 py-4 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.orderNumber}
                  onClick={() => router.push(`/admin/orders/${order.orderNumber}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-[var(--color-kk-navy)]">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_BADGE_CLASSES[order.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {order.paymentMethod === 'MOBILE_MONEY' ? 'Mobile Money' : 'Cash on Delivery'}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    GH₵{order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
