'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  GarmentType,
  GARMENT_TYPE_LABELS,
  MeasurementUnit,
  getMeasurementFields,
  MeasurementData,
} from '@/types/measurement';
import { saveMeasurementProfile } from '@/lib/measurementStorage';

export default function ManualMeasurementPage() {
  const router = useRouter();

  const [step, setStep] = useState<'type' | 'form'>('type');
  const [profileName, setProfileName] = useState('');
  const [garmentType, setGarmentType] = useState<GarmentType>('SUIT');
  const [measurements, setMeasurements] = useState<MeasurementData>({});
  const [error, setError] = useState('');

  const measurementFields = getMeasurementFields(garmentType);

  const handleTypeSelect = (type: GarmentType) => {
    setGarmentType(type);
    setMeasurements({});
    setStep('form');
  };

  const handleMeasurementChange = (key: string, value: string, unit: MeasurementUnit) => {
    if (value.trim()) {
      setMeasurements((prev) => ({
        ...prev,
        [key]: `${value} ${unit}`,
      }));
    } else {
      const newMeasurements = { ...measurements };
      delete newMeasurements[key];
      setMeasurements(newMeasurements);
    }
  };

  const parseMeasurement = (measurementString: string): { value: string; unit: MeasurementUnit } => {
    const parts = measurementString.split(' ');
    return {
      value: parts[0] || '',
      unit: (parts[1] as MeasurementUnit) || 'inches',
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    // Check if at least one measurement is provided
    if (Object.keys(measurements).length === 0) {
      setError('Please enter at least one measurement');
      return;
    }

    try {
      // Save profile
      saveMeasurementProfile({
        profileName: profileName.trim(),
        garmentType,
        measurementData: measurements,
      });

      // Redirect to profiles page
      router.push('/measurements/profiles');
    } catch {
      setError('Failed to save measurement profile. Please try again.');
    }
  };

  if (step === 'type') {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--color-kk-navy)] mb-4">
              Enter Measurements Manually
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the type of garment to enter measurements for
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(GARMENT_TYPE_LABELS).map(([value, label]) => (
              <button
                key={value}
                onClick={() => handleTypeSelect(value as GarmentType)}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[var(--color-kk-gold)] group"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-kk-gold)] bg-opacity-10 flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
                    <svg
                      className="w-10 h-10 text-[var(--color-kk-gold)]"
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
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-kk-navy)] mb-2">{label}</h3>
                  <p className="text-sm text-gray-600">
                    Click to enter {label.toLowerCase()} measurements
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-2">Have a measurement document?</p>
            <button
              onClick={() => router.push('/measurements/upload')}
              className="text-[var(--color-kk-gold)] font-semibold hover:text-[var(--color-kk-accent)] transition-colors"
            >
              ← Upload Document Instead
            </button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStep('type')}
              className="text-[var(--color-kk-gold)] font-semibold hover:text-[var(--color-kk-accent)] mb-4 inline-flex items-center"
            >
              ← Change Garment Type
            </button>
            <h1 className="text-4xl font-bold text-[var(--color-kk-navy)] mb-2">
              {GARMENT_TYPE_LABELS[garmentType]} Measurements
            </h1>
            <p className="text-lg text-gray-600">
              Enter your measurements below. You can use inches or centimeters.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Profile Name */}
            <div className="mb-8">
              <label htmlFor="profileName" className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Name *
              </label>
              <input
                type="text"
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder={`e.g., My ${GARMENT_TYPE_LABELS[garmentType]} Measurements`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] focus:border-transparent"
                required
              />
            </div>

            {/* Measurement Fields */}
            <div className="space-y-6 mb-8">
              <h3 className="text-lg font-bold text-[var(--color-kk-navy)] mb-4">
                Enter Measurements
              </h3>

              {measurementFields.map((field) => {
                const currentValue = measurements[field.key];
                const parsed = currentValue ? parseMeasurement(currentValue) : { value: '', unit: 'inches' as MeasurementUnit };

                return (
                  <div key={field.key} className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <p className="text-xs text-gray-500 mb-3 flex items-start">
                      <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {field.guide}
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={parsed.value}
                        onChange={(e) => handleMeasurementChange(field.key, e.target.value, parsed.unit)}
                        placeholder="Enter value"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] focus:border-transparent"
                      />
                      <select
                        value={parsed.unit}
                        onChange={(e) =>
                          handleMeasurementChange(field.key, parsed.value, e.target.value as MeasurementUnit)
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] focus:border-transparent"
                      >
                        <option value="inches">inches</option>
                        <option value="cm">cm</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button type="submit" variant="primary" className="flex-1">
                Save Measurements
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/measurements/profiles')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}
