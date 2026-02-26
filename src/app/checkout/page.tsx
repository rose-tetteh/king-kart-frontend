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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string[]>([]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs for images
    validFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      } else {
        // For videos, add a placeholder
        setFilePreview(prev => [...prev, 'video']);
      }
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreview(prev => prev.filter((_, i) => i !== index));
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
      status: 'RECEIVED' as const,
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

                  {/* File Upload Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Design References (Optional)
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      Upload pictures or videos showing what you want. You can upload multiple files.
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--color-kk-gold)] transition-colors">
                      <input
                        type="file"
                        id="fileUpload"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="fileUpload" className="cursor-pointer">
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Images and Videos (PNG, JPG, GIF, MP4, MOV)
                        </p>
                      </label>
                    </div>

                    {/* Preview Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Uploaded Files ({uploadedFiles.length})
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                {file.type.startsWith('image/') ? (
                                  filePreview[index] && filePreview[index] !== 'video' ? (
                                    <img
                                      src={filePreview[index]}
                                      alt={`Upload ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center">
                                    <svg className="w-8 h-8 text-[var(--color-kk-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs text-gray-600 mt-1">Video</span>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Remove file"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-bold text-[var(--color-kk-navy)] mb-3">Design References</h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            {file.type.startsWith('image/') ? (
                              filePreview[index] && filePreview[index] !== 'video' ? (
                                <img
                                  src={filePreview[index]}
                                  alt={`Reference ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--color-kk-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{uploadedFiles.length} file(s) uploaded</p>
                    </div>
                  )}

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
