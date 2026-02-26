'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Service, ServiceCategory, PricingType } from '@/types/service';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  category: z.enum(['SUIT', 'AFRICAN_PRINT', 'NURSES_SCRUBS', 'EMBROIDERY', 'TSHIRT_CUSTOMIZATION']),
  description: z.string().min(1, 'Description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  basePrice: z.number().min(0, 'Price must be positive'),
  pricingType: z.enum(['FIXED', 'STARTING_FROM']),
  requiresMeasurements: z.boolean(),
  imageUrls: z.string().min(1, 'At least one image URL is required'),
  features: z.string().min(1, 'At least one feature is required'),
  turnaroundTime: z.string().min(1, 'Turnaround time is required'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Service, 'id'>) => void;
  service?: Service | null;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  service,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      category: 'SUIT',
      description: '',
      fullDescription: '',
      basePrice: 0,
      pricingType: 'STARTING_FROM',
      requiresMeasurements: true,
      imageUrls: '',
      features: '',
      turnaroundTime: '',
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        category: service.category,
        description: service.description,
        fullDescription: service.fullDescription,
        basePrice: service.basePrice,
        pricingType: service.pricingType,
        requiresMeasurements: service.requiresMeasurements,
        imageUrls: service.imageUrls.join('\n'),
        features: service.features.join('\n'),
        turnaroundTime: service.turnaroundTime,
      });
    } else {
      reset({
        name: '',
        category: 'SUIT',
        description: '',
        fullDescription: '',
        basePrice: 0,
        pricingType: 'STARTING_FROM',
        requiresMeasurements: true,
        imageUrls: '',
        features: '',
        turnaroundTime: '',
      });
    }
  }, [service, reset]);

  const handleFormSubmit = (data: ServiceFormData) => {
    setIsSubmitting(true);

    const serviceData: Omit<Service, 'id'> = {
      ...data,
      imageUrls: data.imageUrls.split('\n').map(url => url.trim()).filter(Boolean),
      features: data.features.split('\n').map(f => f.trim()).filter(Boolean),
    };

    onSubmit(serviceData);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-kk-navy)]">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-kk-navy)] mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Service Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Custom Tailored Suits"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)]"
                >
                  <option value="SUIT">Custom Suits</option>
                  <option value="AFRICAN_PRINT">African Prints</option>
                  <option value="NURSES_SCRUBS">Nurses' Scrubs</option>
                  <option value="EMBROIDERY">Embroidery</option>
                  <option value="TSHIRT_CUSTOMIZATION">T-Shirt Customization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Turnaround Time *
                </label>
                <input
                  {...register('turnaroundTime')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.turnaroundTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 3-4 weeks"
                />
                {errors.turnaroundTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.turnaroundTime.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Short Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief description for the service card"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Full Description *
                </label>
                <textarea
                  {...register('fullDescription')}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.fullDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Detailed description for the service detail page"
                />
                {errors.fullDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullDescription.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-kk-navy)] mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Base Price (GH₵) *
                </label>
                <input
                  {...register('basePrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.basePrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.basePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.basePrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Pricing Type *
                </label>
                <select
                  {...register('pricingType')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)]"
                >
                  <option value="FIXED">Fixed Price</option>
                  <option value="STARTING_FROM">Starting From</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-kk-navy)] mb-4">Additional Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  {...register('requiresMeasurements')}
                  type="checkbox"
                  id="requiresMeasurements"
                  className="w-4 h-4 text-[var(--color-kk-gold)] border-gray-300 rounded focus:ring-[var(--color-kk-gold)]"
                />
                <label htmlFor="requiresMeasurements" className="text-sm font-medium text-gray-700">
                  Requires Measurements
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Image URLs * (one per line)
                </label>
                <textarea
                  {...register('imageUrls')}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] font-mono text-sm ${
                    errors.imageUrls ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
                {errors.imageUrls && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrls.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--color-kk-navy)] mb-2">
                  Features * (one per line)
                </label>
                <textarea
                  {...register('features')}
                  rows={6}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-kk-gold)] ${
                    errors.features ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Premium Italian wool fabrics&#10;Custom measurements and fitting&#10;Complimentary alterations"
                />
                {errors.features && (
                  <p className="mt-1 text-sm text-red-600">{errors.features.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)] font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
