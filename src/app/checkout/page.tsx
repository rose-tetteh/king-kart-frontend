'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { CheckoutFormData } from '@/types/cart';
import { saveOrder, generateOrderNumber } from '@/lib/cartStorage';

type CheckoutStep = 'info' | 'review' | 'payment';

type FormErrors = {
  [K in keyof CheckoutFormData]?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>('info');
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    city: '',
    postalCode: '',
    customerNotes: '',
    tailorNotes: '',
    paymentMethod: 'CASH_ON_DELIVERY',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const validateStep = (currentStep: CheckoutStep): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 'info') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    }

    if (currentStep === 'payment') {
      if (formData.paymentMethod === 'MOBILE_MONEY') {
        if (!formData.mobileMoneyNetwork) newErrors.mobileMoneyNetwork = 'Select a network';
        if (!formData.mobileMoneyPhone?.trim()) newErrors.mobileMoneyPhone = 'Phone number is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'info' && validateStep('info')) {
      setStep('review');
    } else if (step === 'review') {
      setStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep('payment')) return;

    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderNumber = generateOrderNumber();
    const order = {
      orderNumber,
      items: cart.items,
      customerInfo: formData,
      total: cart.total,
      status: 'PENDING' as const,
      isPaid: formData.paymentMethod === 'MOBILE_MONEY',
      createdAt: new Date().toISOString(),
      paymentMethod: formData.paymentMethod,
      paymentDetails: formData.paymentMethod === 'MOBILE_MONEY' ? {
        mobileMoneyNetwork: formData.mobileMoneyNetwork,
        mobileMoneyPhone: formData.mobileMoneyPhone,
      } : undefined,
    };

    saveOrder(order);
    clearCart();

    router.push(`/orders/${orderNumber}`);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          step === 'info' ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]' : 'bg-green-500 text-white'
        } font-bold`}>
          {step === 'info' ? '1' : '✓'}
        </div>
        <div className={`w-24 h-1 ${step === 'info' ? 'bg-gray-300' : 'bg-green-500'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          step === 'review' ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]' :
          step === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
        } font-bold`}>
          {step === 'payment' ? '✓' : step === 'review' ? '2' : '2'}
        </div>
        <div className={`w-24 h-1 ${step === 'payment' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          step === 'payment' ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]' : 'bg-gray-300 text-gray-600'
        } font-bold`}>
          3
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        <h1 className="text-4xl font-bold text-[var(--color-kk-navy)] mb-8 text-center">
          Checkout
        </h1>

        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Step 1: Customer Information */}
              {step === 'info' && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-6">
                    Customer Information
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+233 XX XXX XXXX"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                        errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.deliveryAddress && <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)]"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      value={formData.customerNotes}
                      onChange={(e) => setFormData({ ...formData, customerNotes: e.target.value })}
                      rows={2}
                      placeholder="Any special delivery instructions..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)]"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tailor Notes (Optional)
                    </label>
                    <textarea
                      value={formData.tailorNotes}
                      onChange={(e) => setFormData({ ...formData, tailorNotes: e.target.value })}
                      rows={2}
                      placeholder="Special instructions for the tailor..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)]"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="primary" className="flex-1" onClick={handleNext}>
                      Continue to Review
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/cart')}>
                      Back to Cart
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Review Order */}
              {step === 'review' && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-6">
                    Review Your Order
                  </h2>

                  {/* Customer Info */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[var(--color-kk-navy)]">Customer Information</h3>
                      <button
                        onClick={() => setStep('info')}
                        className="text-[var(--color-kk-gold)] text-sm font-semibold hover:text-[var(--color-kk-accent)]"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.email}<br />
                      {formData.phone}<br />
                      {formData.deliveryAddress}, {formData.city}
                      {formData.postalCode && `, ${formData.postalCode}`}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-bold text-[var(--color-kk-navy)] mb-4">Order Items</h3>
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.service.imageUrls[0]}
                            alt={item.service.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--color-kk-navy)]">{item.service.name}</h4>
                          {item.measurementProfile && (
                            <p className="text-sm text-gray-600">
                              Measurements: {item.measurementProfile.profileName}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="font-semibold text-[var(--color-kk-gold)]">
                            GH₵{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button variant="primary" className="flex-1" onClick={handleNext}>
                      Continue to Payment
                    </Button>
                    <Button variant="outline" onClick={() => setStep('info')}>
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4 mb-6">
                    {/* Cash on Delivery */}
                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-[var(--color-kk-gold)] bg-yellow-50'
                        : 'border-gray-300 hover:border-[var(--color-kk-accent)]'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CASH_ON_DELIVERY"
                        checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'CASH_ON_DELIVERY' | 'MOBILE_MONEY' })}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <p className="font-semibold text-[var(--color-kk-navy)]">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay with cash when your order is delivered</p>
                      </div>
                    </label>

                    {/* Mobile Money */}
                    <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === 'MOBILE_MONEY'
                        ? 'border-[var(--color-kk-gold)] bg-yellow-50'
                        : 'border-gray-300 hover:border-[var(--color-kk-accent)]'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="MOBILE_MONEY"
                        checked={formData.paymentMethod === 'MOBILE_MONEY'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'CASH_ON_DELIVERY' | 'MOBILE_MONEY' })}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-[var(--color-kk-navy)]">Mobile Money</p>
                        <p className="text-sm text-gray-600 mb-3">Pay via MTN, Vodafone, or AirtelTigo</p>

                        {formData.paymentMethod === 'MOBILE_MONEY' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Network *
                              </label>
                              <select
                                value={formData.mobileMoneyNetwork || ''}
                                onChange={(e) => setFormData({ ...formData, mobileMoneyNetwork: e.target.value as 'MTN' | 'VODAFONE' | 'AIRTELTIGO' })}
                                className={`w-full px-4 py-2 border rounded-lg ${
                                  errors.mobileMoneyNetwork ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select Network</option>
                                <option value="MTN">MTN Mobile Money</option>
                                <option value="VODAFONE">Vodafone Cash</option>
                                <option value="AIRTELTIGO">AirtelTigo Money</option>
                              </select>
                              {errors.mobileMoneyNetwork && (
                                <p className="text-red-500 text-sm mt-1">{errors.mobileMoneyNetwork}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                value={formData.mobileMoneyPhone || ''}
                                onChange={(e) => setFormData({ ...formData, mobileMoneyPhone: e.target.value })}
                                placeholder="024XXXXXXX"
                                className={`w-full px-4 py-2 border rounded-lg ${
                                  errors.mobileMoneyPhone ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {errors.mobileMoneyPhone && (
                                <p className="text-red-500 text-sm mt-1">{errors.mobileMoneyPhone}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                    <Button variant="outline" onClick={() => setStep('review')} disabled={isProcessing}>
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-[var(--color-kk-navy)] mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">GH₵{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">TBD</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-[var(--color-kk-navy)] mb-4">
                <span>Total</span>
                <span>GH₵{cart.total.toFixed(2)}</span>
              </div>

              <div className="text-xs text-gray-500">
                <p className="mb-2">By placing this order, you agree to our Terms & Conditions</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
