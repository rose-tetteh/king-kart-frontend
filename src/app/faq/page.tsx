'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Orders
  {
    category: 'Orders',
    question: 'How do I place an order?',
    answer: 'Browse our services, select the one you need, add it to your cart, and proceed to checkout. You\'ll need to provide your measurements and contact details to complete the order.',
  },
  {
    category: 'Orders',
    question: 'Can I cancel or modify my order?',
    answer: 'You can cancel or modify your order within 24 hours of placement by contacting us. Once production has started, cancellations may incur a fee.',
  },
  {
    category: 'Orders',
    question: 'How do I track my order?',
    answer: 'After logging in, visit the "My Orders" page to view your order status and tracking information. You\'ll also receive email updates at each stage of production.',
  },

  // Measurements
  {
    category: 'Measurements',
    question: 'How do I provide my measurements?',
    answer: 'You can provide measurements in three ways: 1) Enter them manually using our measurement guide, 2) Upload photos/measurement sheets, or 3) Save measurement profiles for future use.',
  },
  {
    category: 'Measurements',
    question: 'What if my measurements are incorrect?',
    answer: 'We offer complimentary alterations within 30 days of delivery if there are measurement discrepancies. Please review your measurements carefully before submitting your order.',
  },
  {
    category: 'Measurements',
    question: 'Can I save multiple measurement profiles?',
    answer: 'Yes! You can save multiple measurement profiles for different people or body types. This makes reordering quick and convenient.',
  },

  // Pricing
  {
    category: 'Pricing',
    question: 'What does "Starting From" mean?',
    answer: '"Starting From" prices indicate the base price. Final cost may vary based on fabric choice, customization options, and complexity of the design.',
  },
  {
    category: 'Pricing',
    question: 'Do you offer discounts?',
    answer: 'We occasionally offer seasonal promotions and bulk order discounts. Subscribe to our newsletter to stay updated on special offers.',
  },
  {
    category: 'Pricing',
    question: 'What payment methods do you accept?',
    answer: 'We accept mobile money, bank transfers, and credit/debit cards. Full payment is required before we begin production.',
  },

  // Delivery
  {
    category: 'Delivery',
    question: 'How long does delivery take?',
    answer: 'Turnaround times vary by service: Custom suits (3-4 weeks), African prints (2-3 weeks), Nurses\' scrubs (1-2 weeks). Rush orders may be available for an additional fee.',
  },
  {
    category: 'Delivery',
    question: 'Do you deliver outside Accra?',
    answer: 'Yes, we deliver nationwide in Ghana. Delivery fees vary based on location. International shipping is available for select items.',
  },
  {
    category: 'Delivery',
    question: 'What if I\'m not satisfied with my order?',
    answer: 'Customer satisfaction is our priority. If you\'re not satisfied, contact us within 7 days of delivery. We offer free alterations or exchanges for manufacturing defects.',
  },

  // Services
  {
    category: 'Services',
    question: 'Can I bring my own fabric?',
    answer: 'Yes! We welcome custom fabrics. Please note that turnaround time may vary, and we recommend bringing 10% extra fabric to account for patterns and shrinkage.',
  },
  {
    category: 'Services',
    question: 'Do you offer rush services?',
    answer: 'Rush services are available for most items with a 50% surcharge. Contact us to check availability before placing a rush order.',
  },
  {
    category: 'Services',
    question: 'Can I see samples before ordering?',
    answer: 'We have a physical showroom in Accra where you can view fabric samples and previous work. Contact us to schedule a visit.',
  },
];

const categories = ['All', 'Orders', 'Measurements', 'Pricing', 'Delivery', 'Services'];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = activeCategory === 'All'
    ? faqData
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-kk-navy)] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our services, ordering process, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)]'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No questions found in this category
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-[var(--color-kk-gold)]/10 text-[var(--color-kk-gold)] text-xs font-semibold rounded-full mb-2">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--color-kk-navy)]">
                      {faq.question}
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 text-[var(--color-kk-gold)] transition-transform flex-shrink-0 ml-4 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our team is here to help!
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)] font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </Container>
    </main>
  );
}
