'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { mockServices } from '@/data/services';
import { ServiceCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/service';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { value: 'ALL', label: 'All Services' },
    { value: 'SUIT', label: 'Suits' },
    { value: 'AFRICAN_PRINT', label: 'African Prints' },
    { value: 'NURSES_SCRUBS', label: "Nurses' Scrubs" },
    { value: 'EMBROIDERY', label: 'Embroidery' },
    { value: 'TSHIRT_CUSTOMIZATION', label: 'T-Shirts' },
  ];

  const filteredServices =
    selectedCategory === 'ALL'
      ? mockServices
      : mockServices.filter((service) => service.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-kk-navy)] mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our range of premium custom tailoring services, crafted with excellence and attention to detail.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.value
                  ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)] shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No services found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-8">
              {filteredServices.map((service) => (
                <div key={service.id} className="group flex flex-col">
                  <Card
                    title={service.name}
                    description={service.description}
                    image={service.imageUrls[0]}
                    href={`/services/${service.id}`}
                    className="transition-transform duration-300 group-hover:scale-105"
                    imagePosition={service.category === 'AFRICAN_PRINT' ? 'top' : 'center'}
                  />
                  <div className="mt-4 px-2 flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          CATEGORY_COLORS[service.category as ServiceCategory]
                        }`}
                      >
                        {CATEGORY_LABELS[service.category as ServiceCategory]}
                      </span>
                      {service.requiresMeasurements && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          Measurements Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          {service.pricingType === 'STARTING_FROM' ? 'Starting from' : 'Fixed Price'}
                        </p>
                        <p className="text-2xl font-bold text-[var(--color-kk-gold)]">
                          GH₵{service.basePrice}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Turnaround</p>
                        <p className="text-sm font-semibold text-[var(--color-kk-navy)]">
                          {service.turnaroundTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-center text-gray-600">
              Showing {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'}
            </div>
          </>
        )}
      </Container>
    </main>
  );
}
