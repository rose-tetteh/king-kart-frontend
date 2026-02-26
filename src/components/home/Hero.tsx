import React from 'react';
import Image from 'next/image';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-[var(--color-kk-navy)] via-[var(--color-kk-navy)] to-[var(--color-kk-olive)] text-white py-20 md:py-32">
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-4 border-[var(--color-kk-gold)] opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full border-4 border-[var(--color-kk-accent)] opacity-20"></div>

      <Container>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-[var(--color-kk-gold)]">KING KART</span>
          </h1>
          <p className="text-2xl md:text-3xl font-semibold mb-6 text-[var(--color-kk-accent)]">
            WE STYLE YOU!
          </p>

          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Experience premium custom tailoring with professional suits, stunning African prints,
            comfortable nurses&apos; scrubs, and personalized embroidery services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" size="lg" href="/services">
              Browse Services
            </Button>
            <Button variant="outline" size="lg" href="/services">
              Get Started
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-[var(--color-kk-gold)]">100+</p>
              <p className="text-sm text-gray-300">Happy Clients</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-kk-gold)]">5+</p>
              <p className="text-sm text-gray-300">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-kk-gold)]">100%</p>
              <p className="text-sm text-gray-300">Quality Guarantee</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
