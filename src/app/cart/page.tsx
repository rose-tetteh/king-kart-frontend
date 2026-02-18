'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { GARMENT_TYPE_LABELS } from '@/types/measurement';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem } = useCart();

  if (cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some custom clothing items to get started!
            </p>
            <Button variant="primary" onClick={() => router.push('/services')}>
              Browse Services
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        <h1 className="text-4xl font-bold text-[var(--color-kk-navy)] mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.service.imageUrls[0]}
                      alt={item.service.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-bold text-[var(--color-kk-navy)]">
                        {item.service.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Measurement Profile */}
                    {item.measurementProfile && (
                      <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Measurement Profile
                        </p>
                        <p className="text-sm text-blue-700">
                          {item.measurementProfile.profileName} (
                          {GARMENT_TYPE_LABELS[item.measurementProfile.garmentType]})
                        </p>
                      </div>
                    )}

                    {/* Customization */}
                    {item.customizationData && Object.keys(item.customizationData).length > 0 && (
                      <div className="mb-3 text-sm text-gray-600">
                        <p className="font-semibold mb-1">Customization:</p>
                        {item.customizationData.fabric && (
                          <p>Fabric: {item.customizationData.fabric}</p>
                        )}
                        {item.customizationData.color && <p>Color: {item.customizationData.color}</p>}
                        {item.customizationData.specialInstructions && (
                          <p>Notes: {item.customizationData.specialInstructions}</p>
                        )}
                      </div>
                    )}

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-2xl font-bold text-[var(--color-kk-gold)]">
                          GH₵{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>GH₵{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-[var(--color-kk-navy)]">
                    <span>Total</span>
                    <span>GH₵{cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button variant="primary" className="w-full mb-3" onClick={() => router.push('/checkout')}>
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push('/services')}>
                Continue Shopping
              </Button>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Perfect fit guarantee
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium quality materials
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Expert craftsmanship
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
