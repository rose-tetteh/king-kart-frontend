'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getServiceById, mockServices } from '@/data/services';
import { CATEGORY_LABELS, CATEGORY_COLORS, ServiceCategory } from '@/types/service';
import { MeasurementProfile, GARMENT_TYPE_LABELS } from '@/types/measurement';
import { getMeasurementProfiles } from '@/lib/measurementStorage';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const serviceId = params.id as string;
  const service = getServiceById(serviceId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [measurementProfiles, setMeasurementProfiles] = useState<MeasurementProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');

  // TODO: Replace with actual authentication check from auth context
  const isLoggedIn = true; // Mock authentication state - TEMPORARY for testing

  useEffect(() => {
    if (service?.requiresMeasurements) {
      const profiles = getMeasurementProfiles();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMeasurementProfiles(profiles);
    }
  }, [service]);

  const handleAddToCartClick = () => {
    if (!service) return;

    // Check if user is logged in first
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // If service requires measurements, show measurement selection modal
    if (service.requiresMeasurements) {
      setShowMeasurementModal(true);
    } else {
      // Add to cart directly if no measurements needed
      addToCart({
        service,
        quantity: 1,
        price: service.basePrice,
      });
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
  };

  const handleConfirmAddToCart = () => {
    if (!service) return;

    const selectedProfile = measurementProfiles.find(p => p.id === selectedProfileId);

    addToCart({
      service,
      quantity: 1,
      price: service.basePrice,
      measurementProfileId: selectedProfile?.id,
      measurementProfile: selectedProfile,
    });

    setShowMeasurementModal(false);
    setSelectedProfileId('');
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  if (!service) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-[var(--color-kk-navy)] mb-4">
              Service Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The service you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Button variant="primary" onClick={() => router.push('/services')}>
              Back to Services
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  // Get related services (same category, excluding current)
  const relatedServices = mockServices
    .filter((s) => s.category === service.category && s.id !== service.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-[var(--color-kk-gold)]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/services" className="hover:text-[var(--color-kk-gold)]">
                Services
              </Link>
            </li>
            <li>/</li>
            <li className="text-[var(--color-kk-navy)] font-semibold">{service.name}</li>
          </ol>
        </nav>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4 bg-gray-100 shadow-lg">
              <Image
                src={service.imageUrls[selectedImageIndex]}
                alt={service.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {service.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all bg-gray-100 ${
                    selectedImageIndex === index
                      ? 'border-[var(--color-kk-gold)] scale-105'
                      : 'border-gray-200 hover:border-[var(--color-kk-accent)]'
                  }`}
                >
                  <Image
                    src={url}
                    alt={`${service.name} ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Service Info */}
          <div>
            <div className="mb-4">
              <span
                className={`inline-block text-sm font-semibold px-4 py-2 rounded-full ${
                  CATEGORY_COLORS[service.category as ServiceCategory]
                }`}
              >
                {CATEGORY_LABELS[service.category as ServiceCategory]}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-[var(--color-kk-navy)] mb-4">{service.name}</h1>

            <div className="flex items-baseline gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">
                  {service.pricingType === 'STARTING_FROM' ? 'Starting from' : 'Fixed Price'}
                </p>
                <p className="text-4xl font-bold text-[var(--color-kk-gold)]">GH₵{service.basePrice}</p>
              </div>
              <div className="ml-8">
                <p className="text-sm text-gray-500">Turnaround Time</p>
                <p className="text-lg font-semibold text-[var(--color-kk-navy)]">
                  {service.turnaroundTime}
                </p>
              </div>
            </div>

            {service.requiresMeasurements && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Measurements Required</p>
                  <p className="text-sm text-blue-800">
                    This service requires custom measurements. You&apos;ll be able to select or add your
                    measurements when adding to cart.
                  </p>
                </div>
              </div>
            )}

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{service.fullDescription}</p>

            {showAddedMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-semibold">Added to cart!</span>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <Button variant="primary" size="lg" className="flex-1" onClick={handleAddToCartClick}>
                {service.requiresMeasurements ? 'Select Measurements & Add to Cart' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push('/services')}>
                Back to Services
              </Button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-[var(--color-kk-navy)] mb-4">What&apos;s Included</h3>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[var(--color-kk-gold)] mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-3xl font-bold text-[var(--color-kk-navy)] mb-8 text-center">
              Related Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map((relatedService) => (
                <Card
                  key={relatedService.id}
                  title={relatedService.name}
                  description={relatedService.description}
                  image={relatedService.imageUrls[0]}
                  href={`/services/${relatedService.id}`}
                  imagePosition={relatedService.category === 'AFRICAN_PRINT' ? 'top' : 'center'}
                />
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Login/Register Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-kk-gold)] rounded-full mb-4">
                <svg className="w-8 h-8 text-[var(--color-kk-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-2">Login Required</h2>
              <p className="text-gray-600">
                Please create an account or sign in to add items to your cart and place orders.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => router.push('/register')}
              >
                Create Account
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Measurement Selection Modal */}
      {showMeasurementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--color-kk-navy)]">Select Measurements</h2>
              <button
                onClick={() => {
                  setShowMeasurementModal(false);
                  setSelectedProfileId('');
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {measurementProfiles.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-4">
                    Select a saved measurement profile or create a new one:
                  </p>

                  {/* Saved Profiles */}
                  <div className="space-y-3 mb-6">
                    {measurementProfiles.map((profile) => (
                      <label
                        key={profile.id}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedProfileId === profile.id
                            ? 'border-[var(--color-kk-gold)] bg-yellow-50'
                            : 'border-gray-300 hover:border-[var(--color-kk-accent)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="measurementProfile"
                          value={profile.id}
                          checked={selectedProfileId === profile.id}
                          onChange={(e) => setSelectedProfileId(e.target.value)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-[var(--color-kk-navy)]">{profile.profileName}</p>
                          <p className="text-sm text-gray-600">
                            {GARMENT_TYPE_LABELS[profile.garmentType]}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(profile.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleConfirmAddToCart}
                      disabled={!selectedProfileId}
                    >
                      Add to Cart with Selected Measurements
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Or create new measurements:</p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push('/measurements/manual')}
                      >
                        Enter Manually
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push('/measurements/upload')}
                      >
                        Upload File
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-6">
                    You don&apos;t have any saved measurement profiles yet. Create one to continue:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">Why measurements?</p>
                          <p className="text-sm text-blue-700">
                            This service requires precise measurements to ensure a perfect fit. Your measurements
                            will be saved for future orders.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => router.push('/measurements/manual')}
                        className="p-6 border-2 border-gray-300 rounded-lg hover:border-[var(--color-kk-gold)] transition-colors text-left"
                      >
                        <svg className="w-8 h-8 text-[var(--color-kk-gold)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <h3 className="font-bold text-[var(--color-kk-navy)] mb-1">Enter Manually</h3>
                        <p className="text-sm text-gray-600">Guided form with measurement instructions</p>
                      </button>

                      <button
                        onClick={() => router.push('/measurements/upload')}
                        className="p-6 border-2 border-gray-300 rounded-lg hover:border-[var(--color-kk-gold)] transition-colors text-left"
                      >
                        <svg className="w-8 h-8 text-[var(--color-kk-gold)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <h3 className="font-bold text-[var(--color-kk-navy)] mb-1">Upload File</h3>
                        <p className="text-sm text-gray-600">Upload a measurement chart or document</p>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
