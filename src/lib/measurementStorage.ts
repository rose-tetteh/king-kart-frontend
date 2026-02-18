import { MeasurementProfile } from '@/types/measurement';

const STORAGE_KEY = 'kingkart_measurement_profiles';
const USER_ID = 'mock-user-1'; // Mock user ID for now

// Get all measurement profiles for current user
export const getMeasurementProfiles = (): MeasurementProfile[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const allProfiles: MeasurementProfile[] = JSON.parse(stored);
  return allProfiles.filter(profile => profile.userId === USER_ID);
};

// Get a single profile by ID
export const getMeasurementProfile = (id: string): MeasurementProfile | null => {
  const profiles = getMeasurementProfiles();
  return profiles.find(profile => profile.id === id) || null;
};

// Save a new measurement profile
export const saveMeasurementProfile = (profile: Omit<MeasurementProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): MeasurementProfile => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const allProfiles: MeasurementProfile[] = stored ? JSON.parse(stored) : [];

  const newProfile: MeasurementProfile = {
    ...profile,
    id: `profile-${Date.now()}`,
    userId: USER_ID,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  allProfiles.push(newProfile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProfiles));

  return newProfile;
};

// Update an existing profile
export const updateMeasurementProfile = (id: string, updates: Partial<MeasurementProfile>): MeasurementProfile | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  const allProfiles: MeasurementProfile[] = JSON.parse(stored);
  const index = allProfiles.findIndex(profile => profile.id === id && profile.userId === USER_ID);

  if (index === -1) return null;

  allProfiles[index] = {
    ...allProfiles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProfiles));
  return allProfiles[index];
};

// Delete a profile
export const deleteMeasurementProfile = (id: string): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;

  const allProfiles: MeasurementProfile[] = JSON.parse(stored);
  const filtered = allProfiles.filter(profile => !(profile.id === id && profile.userId === USER_ID));

  if (filtered.length === allProfiles.length) return false; // Profile not found

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};
