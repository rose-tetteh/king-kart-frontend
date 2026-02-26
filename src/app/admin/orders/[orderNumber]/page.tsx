'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderByNumber, updateOrderStatus } from '@/lib/adminOrderStorage';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/types/cart';
import { GARMENT_TYPE_LABELS } from '@/types/measurement';

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  RECEIVED: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  READY_FOR_DELIVERY: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-700',
};

const ALL_STATUSES: OrderStatus[] = [
  'RECEIVED',
  'IN_PROGRESS',
  'READY_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
];

const formatDate = (isoString: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('RECEIVED');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = getOrderByNumber(orderNumber);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(found);
    if (found) setSelectedStatus(found.status);
    setLoading(false);
  }, [orderNumber]);

  const handleSaveStatus = () => {
    if (!order) return;
    updateOrderStatus(orderNumber, selectedStatus);
    setOrder({ ...order, status: selectedStatus });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-kk-gold)]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <Link
          href="/admin/orders"
          className="text-[var(--color-kk-gold)] hover:underline text-sm mb-6 inline-block"
        >
          ← Back to Orders
        </Link>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">Order not found: {orderNumber}</p>
          <Link
            href="/admin/orders"
            className="mt-4 inline-block text-[var(--color-kk-gold)] hover:underline"
          >
            Go back to orders list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Back Link */}
      <Link
        href="/admin/orders"
        className="text-[var(--color-kk-gold)] hover:underline text-sm mb-6 inline-block"
      >
        ← Back to Orders
      </Link>

      {/* Section 1: Order Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <h1 className="text-2xl font-bold text-[var(--color-kk-navy)]">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-2">{formatDate(order.createdAt)}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              STATUS_BADGE_CLASSES[order.status]
            }`}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      {/* Section 2: Status Update */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold text-[var(--color-kk-navy)] mb-4">Update Status</h2>
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] text-sm"
          >
            {ALL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {ORDER_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <button
            onClick={handleSaveStatus}
            className="px-6 py-2 bg-[var(--color-kk-navy)] text-[var(--color-kk-gold)] font-semibold rounded-lg hover:bg-opacity-90 transition-colors text-sm"
          >
            Save Status
          </button>
          {saved && (
            <p className="text-green-600 text-sm">Status updated successfully.</p>
          )}
        </div>
      </div>

      {/* Section 3: Customer & Delivery Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold text-[var(--color-kk-navy)] mb-4">Customer & Delivery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium text-gray-900">
              {order.customerInfo.firstName} {order.customerInfo.lastName}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{order.customerInfo.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">{order.customerInfo.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-medium text-gray-900">{order.customerInfo.city}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500">Delivery Address</p>
            <p className="font-medium text-gray-900">{order.customerInfo.deliveryAddress}</p>
          </div>
          {order.customerInfo.postalCode && (
            <div>
              <p className="text-gray-500">Postal Code</p>
              <p className="font-medium text-gray-900">{order.customerInfo.postalCode}</p>
            </div>
          )}
        </div>

        {(order.customerInfo.customerNotes || order.customerInfo.tailorNotes) && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {order.customerInfo.customerNotes && (
              <div>
                <p className="text-gray-500 text-sm mb-1">Customer Notes</p>
                <p className="text-gray-900 text-sm">{order.customerInfo.customerNotes}</p>
              </div>
            )}
            {order.customerInfo.tailorNotes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">
                  Tailor Notes
                </p>
                <p className="text-gray-900 text-sm">{order.customerInfo.tailorNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 4: Order Items */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold text-[var(--color-kk-navy)] mb-4">Order Items</h2>
        <div className="space-y-6">
          {order.items.map((item) => (
            <div key={item.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-[var(--color-kk-navy)]">{item.service.name}</h3>
                <p className="font-semibold text-[var(--color-kk-gold)]">
                  GH₵{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</p>

              {/* Measurement Profile */}
              {item.measurementProfile && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Profile:</span>{' '}
                  {item.measurementProfile.profileName} (
                  {GARMENT_TYPE_LABELS[item.measurementProfile.garmentType]})

                  {item.measurementProfile.measurementData &&
                    Object.keys(item.measurementProfile.measurementData).length > 0 && (
                      <div className="mt-2">
                        <table className="text-xs border-collapse w-full max-w-xs">
                          <tbody>
                            {Object.entries(item.measurementProfile.measurementData).map(
                              ([key, value]) => (
                                <tr key={key} className="border-b border-gray-100">
                                  <td className="py-1 pr-4 text-gray-500 capitalize">
                                    {key.replace(/_/g, ' ')}
                                  </td>
                                  <td className="py-1 font-medium">{value}</td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {item.measurementProfile.measurementFileUrl && (
                    <div className="mt-2">
                      <a
                        href={item.measurementProfile.measurementFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-kk-gold)] hover:underline text-xs"
                      >
                        View Measurement File →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Customisation */}
              {item.customizationData &&
                Object.values(item.customizationData).some(Boolean) && (
                  <div className="text-sm text-gray-600">
                    {item.customizationData.fabric && (
                      <p>
                        <span className="font-medium">Fabric:</span> {item.customizationData.fabric}
                      </p>
                    )}
                    {item.customizationData.color && (
                      <p>
                        <span className="font-medium">Color:</span> {item.customizationData.color}
                      </p>
                    )}
                    {item.customizationData.specialInstructions && (
                      <p>
                        <span className="font-medium">Notes:</span>{' '}
                        {item.customizationData.specialInstructions}
                      </p>
                    )}
                    {item.customizationData.designFileUrl && (
                      <a
                        href={item.customizationData.designFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-kk-gold)] hover:underline text-xs"
                      >
                        View Design File →
                      </a>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Payment Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-[var(--color-kk-navy)] mb-4">Payment</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Method</span>
            <span className="font-medium">
              {order.paymentMethod === 'MOBILE_MONEY' ? 'Mobile Money' : 'Cash on Delivery'}
            </span>
          </div>
          {order.paymentDetails?.mobileMoneyNetwork && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Network</span>
                <span className="font-medium">{order.paymentDetails.mobileMoneyNetwork}</span>
              </div>
              {order.paymentDetails.mobileMoneyPhone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{order.paymentDetails.mobileMoneyPhone}</span>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status</span>
            <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-bold">
            <span className="text-[var(--color-kk-navy)]">Total</span>
            <span className="text-[var(--color-kk-gold)]">GH₵{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
