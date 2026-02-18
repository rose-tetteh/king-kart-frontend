'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { GARMENT_TYPE_LABELS } from '@/types/measurement';
import { getMeasurementProfiles, deleteMeasurementProfile } from '@/lib/measurementStorage';
import type { MeasurementProfile } from '@/types/measurement';

export default function MeasurementProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<MeasurementProfile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const loadedProfiles = getMeasurementProfiles();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfiles(loadedProfiles);
  }, []);

  const loadProfiles = () => {
    const loadedProfiles = getMeasurementProfiles();
    setProfiles(loadedProfiles);
  };

  const handleDelete = (id: string) => {
    deleteMeasurementProfile(id);
    setShowDeleteConfirm(null);
    setSelectedProfile(null);
    loadProfiles();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[var(--color-kk-navy)] mb-2">
              My Measurement Profiles
            </h1>
            <p className="text-lg text-gray-600">
              Manage your saved measurements for quick ordering
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/measurements/upload')}>
              Upload File
            </Button>
            <Button variant="primary" onClick={() => router.push('/measurements/manual')}>
              + Add New
            </Button>
          </div>
        </div>

        {profiles.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-300 mb-4"
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
            <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-2">
              No Measurement Profiles Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first measurement profile to streamline your ordering process. You can
              upload a document or enter measurements manually.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" onClick={() => router.push('/measurements/manual')}>
                Enter Manually
              </Button>
              <Button variant="outline" onClick={() => router.push('/measurements/upload')}>
                Upload Document
              </Button>
            </div>
          </div>
        ) : (
          /* Profiles Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-[var(--color-kk-gold)]"
                onClick={() => setSelectedProfile(profile)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[var(--color-kk-navy)] mb-1">
                      {profile.profileName}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {GARMENT_TYPE_LABELS[profile.garmentType]}
                    </span>
                  </div>
                  {profile.measurementFileUrl && (
                    <svg
                      className="w-6 h-6 text-[var(--color-kk-gold)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Created:</span> {formatDate(profile.createdAt)}
                  </p>
                  {profile.measurementFileUrl ? (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Type:</span> Uploaded Document
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Measurements:</span>{' '}
                      {Object.keys(profile.measurementData).length} entered
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfile(profile);
                    }}
                    className="flex-1 px-4 py-2 bg-[var(--color-kk-gold)] text-[var(--color-kk-navy)] rounded-lg font-semibold hover:bg-[var(--color-kk-accent)] transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(profile.id);
                    }}
                    className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedProfile && !showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProfile(null)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-kk-navy)] mb-2">
                      {selectedProfile.profileName}
                    </h2>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {GARMENT_TYPE_LABELS[selectedProfile.garmentType]}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProfile(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {selectedProfile.measurementFileUrl ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-blue-600 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Uploaded Document</p>
                        <p className="text-sm text-blue-700">{selectedProfile.measurementFileUrl}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-kk-navy)] mb-4">
                      Measurements
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedProfile.measurementData).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </p>
                          <p className="text-lg font-semibold text-[var(--color-kk-navy)]">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => {
                        // In Phase 4, this will add to cart
                        alert('Add to cart functionality coming in Phase 4!');
                      }}
                    >
                      Use for Order
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedProfile(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[var(--color-kk-navy)] mb-4">
                Delete Measurement Profile?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this measurement profile? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
