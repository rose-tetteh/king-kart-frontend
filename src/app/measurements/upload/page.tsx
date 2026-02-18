'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { GarmentType, GARMENT_TYPE_LABELS } from '@/types/measurement';
import { saveMeasurementProfile } from '@/lib/measurementStorage';

export default function MeasurementUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileName, setProfileName] = useState('');
  const [garmentType, setGarmentType] = useState<GarmentType>('SUIT');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, JPG, or PNG files only.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit. Please choose a smaller file.';
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const error = validateFile(droppedFile);
      if (error) {
        setError(error);
        return;
      }
      setFile(droppedFile);
      setError('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const error = validateFile(selectedFile);
      if (error) {
        setError(error);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const simulateUpload = (): Promise<string> => {
    return new Promise((resolve) => {
      setIsUploading(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // In a real app, this would be the actual uploaded file URL
            resolve(`/uploads/${file?.name}`);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      // Simulate file upload
      const fileUrl = await simulateUpload();

      // Save profile
      saveMeasurementProfile({
        profileName: profileName.trim(),
        garmentType,
        measurementData: {},
        measurementFileUrl: fileUrl,
      });

      // Redirect to profiles page
      router.push('/measurements/profiles');
    } catch {
      setError('Failed to save measurement profile. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-kk-navy)] mb-4">
            Upload Measurements
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your measurement document (PDF, JPG, or PNG) to save time on manual entry.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Profile Name */}
            <div className="mb-6">
              <label htmlFor="profileName" className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Name *
              </label>
              <input
                type="text"
                id="profileName"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g., My Suit Measurements"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] focus:border-transparent"
                required
              />
            </div>

            {/* Garment Type */}
            <div className="mb-6">
              <label htmlFor="garmentType" className="block text-sm font-semibold text-gray-700 mb-2">
                Garment Type *
              </label>
              <select
                id="garmentType"
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value as GarmentType)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-kk-gold)] focus:border-transparent"
              >
                {Object.entries(GARMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File *
              </label>

              {/* Drag and Drop Area */}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-[var(--color-kk-gold)] bg-yellow-50'
                    : 'border-gray-300 hover:border-[var(--color-kk-accent)]'
                }`}
              >
                {file ? (
                  <div className="space-y-4">
                    <svg
                      className="mx-auto h-12 w-12 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[var(--color-kk-gold)] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-sm text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-4 text-sm text-gray-600">
                      <span className="font-semibold text-[var(--color-kk-gold)]">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-2">PDF, JPG, or PNG (max 10MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 px-6 py-2 bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)] rounded-full font-semibold hover:bg-[var(--color-kk-accent)] transition-colors"
                    >
                      Browse Files
                    </button>
                  </>
                )}
              </div>

              {/* File Type Info */}
              <p className="mt-2 text-xs text-gray-500">
                Accepted formats: PDF, JPG, PNG • Maximum size: 10MB
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button type="submit" variant="primary" className="flex-1" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Save Profile'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/measurements/profiles')}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>

            {/* Alternative Option */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Prefer to enter measurements manually?</p>
              <button
                type="button"
                onClick={() => router.push('/measurements/manual')}
                className="text-[var(--color-kk-gold)] font-semibold hover:text-[var(--color-kk-accent)] transition-colors"
              >
                Enter Measurements Manually →
              </button>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
}
