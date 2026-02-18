import React from 'react';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { mockServices } from '@/data/services';

// Show only Suits, Nurses' Scrubs, and T-Shirt Customisation
const featuredServices = mockServices.filter(service =>
  service.id === '1' || service.id === '3' || service.id === '5'
);

export const FeaturedServices: React.FC = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-kk-navy)] mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our range of premium custom tailoring services, designed to meet your unique style needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div key={service.id} className="flex">
              <Card
                title={service.name}
                description={service.description}
                image={service.imageUrls[0]}
                href={`/services/${service.id}`}
                imagePosition={service.category === 'AFRICAN_PRINT' ? 'top' : 'center'}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center text-[var(--color-kk-gold)] font-semibold hover:text-[var(--color-kk-accent)] transition-colors"
          >
            View All Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
};
