'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getOrderByNumber } from '@/lib/orderStorage';
import { Order } from '@/types/cart';
import { GARMENT_TYPE_LABELS } from '@/types/measurement';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { StatusTimeline } from '@/components/orders/StatusTimeline';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      const foundOrder = getOrderByNumber(orderNumber);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrder(foundOrder);
      setLoading(false);
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-kk-gold)] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </Container>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-red-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t find an order with number {orderNumber}
            </p>
            <Link href="/orders" className="text-[var(--color-kk-gold)] hover:underline">
              ← Back to My Orders
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Back Link */}
        <Link
          href="/orders"
          className="inline-flex items-center text-sm text-gray-600 hover:text-[var(--color-kk-gold)] mb-6 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Orders
        </Link>

        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-kk-navy)] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your order. We&apos;ve received your request and will begin working on it
            shortly.
          </p>
          <div className="inline-block bg-[var(--color-kk-gold)] bg-opacity-10 border border-[var(--color-kk-gold)] rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-[var(--color-kk-navy)]">{order.orderNumber}</p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-kk-navy)]">Order Status</h2>
            <StatusBadge status={order.status} />
          </div>
          <StatusTimeline currentStatus={order.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.service.imageUrls[0]}
                          alt={item.service.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[var(--color-kk-navy)] mb-1">
                          {item.service.name}
                        </h3>

                        {/* Measurement Profile */}
                        {item.measurementProfile && (
                          <div className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold">Measurements:</span>{' '}
                            {item.measurementProfile.profileName} (
                            {GARMENT_TYPE_LABELS[item.measurementProfile.garmentType]})
                          </div>
                        )}

                        {/* Customization */}
                        {item.customizationData &&
                          Object.values(item.customizationData).some(Boolean) && (
                            <div className="mb-2 text-sm text-gray-600">
                              {item.customizationData.fabric && (
                                <p>
                                  <span className="font-semibold">Fabric:</span>{' '}
                                  {item.customizationData.fabric}
                                </p>
                              )}
                              {item.customizationData.color && (
                                <p>
                                  <span className="font-semibold">Color:</span>{' '}
                                  {item.customizationData.color}
                                </p>
                              )}
                              {item.customizationData.specialInstructions && (
                                <p>
                                  <span className="font-semibold">Notes:</span>{' '}
                                  {item.customizationData.specialInstructions}
                                </p>
                              )}
                            </div>
                          )}

                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-lg font-bold text-[var(--color-kk-gold)]">
                            GH₵{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-6">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-gray-900 font-medium">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900 font-medium">{order.customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{order.customerInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">City</p>
                  <p className="text-gray-900 font-medium">{order.customerInfo.city}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                  <p className="text-gray-900 font-medium">{order.customerInfo.deliveryAddress}</p>
                </div>
              </div>

              {(order.customerInfo.customerNotes || order.customerInfo.tailorNotes) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  {order.customerInfo.customerNotes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Customer Notes</p>
                      <p className="text-gray-900">{order.customerInfo.customerNotes}</p>
                    </div>
                  )}
                  {order.customerInfo.tailorNotes && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Special Instructions for Tailor</p>
                      <p className="text-gray-900">{order.customerInfo.tailorNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-6">
                Payment Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-semibold text-gray-900">
                    {order.paymentMethod === 'MOBILE_MONEY' ? 'Mobile Money' : 'Cash on Delivery'}
                  </span>
                </div>
                {order.paymentDetails?.mobileMoneyNetwork && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Network</span>
                      <span className="font-semibold text-gray-900">
                        {order.paymentDetails.mobileMoneyNetwork}
                      </span>
                    </div>
                    {order.paymentDetails.mobileMoneyPhone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone Number</span>
                        <span className="font-semibold text-gray-900">
                          {order.paymentDetails.mobileMoneyPhone}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-[var(--color-kk-navy)]">Total Amount</span>
                    <span className="text-[var(--color-kk-gold)]">GH₵{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24 space-y-4">
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Order Number</p>
                  <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Items</p>
                  <p className="font-semibold text-gray-900">{order.items.length} item(s)</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="primary" className="w-full" onClick={() => router.push('/services')}>
                  Continue Shopping
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                  Print Order
                </Button>
              </div>

              {/* Help Section */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-[var(--color-kk-navy)] mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Phone:</span> +233 XX XXX XXXX
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> support@kingkart.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
