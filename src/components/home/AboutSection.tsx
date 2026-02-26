import React from 'react';
import Image from 'next/image';
import { Container } from '../ui/Container';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-kk-navy)] mb-6">
              Why Choose King Kart?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              At King Kart, we believe that everyone deserves to look and feel their best. Our expert
              tailors combine traditional craftsmanship with modern design to create garments that are
              uniquely yours.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-kk-gold)] flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--color-kk-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-kk-navy)] mb-2">
                    Expert Craftsmanship
                  </h3>
                  <p className="text-gray-600">
                    Years of experience in creating perfect-fit garments tailored to your measurements.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-kk-gold)] flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--color-kk-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-kk-navy)] mb-2">
                    Premium Materials
                  </h3>
                  <p className="text-gray-600">
                    We use only the finest fabrics and materials to ensure lasting quality.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-kk-gold)] flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-[var(--color-kk-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-kk-navy)] mb-2">
                    Personalized Service
                  </h3>
                  <p className="text-gray-600">
                    Every garment is customized to your exact specifications and style preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image/Decorative */}
          <div className="relative">
            <div className="w-full h-96 rounded-lg bg-gradient-to-br from-[var(--color-kk-navy)] to-[var(--color-kk-olive)] flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-32 h-32 relative mx-auto mb-6 bg-white rounded-full p-2">
                  <Image
                    src="/logo.jpeg"
                    alt="King Kart Logo"
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <p className="text-2xl font-bold">KING KART</p>
                <p className="text-lg text-[var(--color-kk-accent)]">WE STYLE YOU!</p>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-4 border-[var(--color-kk-gold)] opacity-30"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border-4 border-[var(--color-kk-accent)] opacity-30"></div>
          </div>
        </div>
      </Container>
    </section>
  );
};
