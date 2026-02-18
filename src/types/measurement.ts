export type GarmentType = 'SUIT' | 'AFRICAN_PRINT' | 'NURSES_SCRUBS';

export type MeasurementUnit = 'inches' | 'cm';

export interface MeasurementData {
  [key: string]: string; // e.g., "chest": "38 inches", "waist": "32 cm"
}

export interface MeasurementProfile {
  id: string;
  userId: string;
  profileName: string;
  garmentType: GarmentType;
  measurementData: MeasurementData;
  measurementFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const GARMENT_TYPE_LABELS: Record<GarmentType, string> = {
  SUIT: 'Suit',
  AFRICAN_PRINT: 'African Print / Dress',
  NURSES_SCRUBS: "Nurses' Scrubs",
};

// Measurement fields for each garment type
export const SUIT_MEASUREMENTS = [
  { key: 'chest', label: 'Chest', guide: 'Measure around the fullest part of your chest' },
  { key: 'waist', label: 'Waist', guide: 'Measure around your natural waistline' },
  { key: 'hips', label: 'Hips', guide: 'Measure around the fullest part of your hips' },
  { key: 'inseam', label: 'Inseam', guide: 'Measure from crotch to ankle along inner leg' },
  { key: 'sleeveLength', label: 'Sleeve Length', guide: 'Measure from shoulder to wrist with arm slightly bent' },
  { key: 'shoulderWidth', label: 'Shoulder Width', guide: 'Measure from shoulder point to shoulder point across back' },
  { key: 'neck', label: 'Neck', guide: 'Measure around the base of your neck' },
  { key: 'shirtLength', label: 'Shirt Length', guide: 'Measure from shoulder to desired hem length' },
];

export const AFRICAN_PRINT_MEASUREMENTS = [
  { key: 'bust', label: 'Bust', guide: 'Measure around the fullest part of your bust' },
  { key: 'waist', label: 'Waist', guide: 'Measure around your natural waistline' },
  { key: 'hips', label: 'Hips', guide: 'Measure around the fullest part of your hips' },
  { key: 'dressLength', label: 'Dress Length', guide: 'Measure from shoulder to desired hem length' },
  { key: 'sleeveLength', label: 'Sleeve Length', guide: 'Measure from shoulder to wrist (if applicable)' },
  { key: 'shoulderWidth', label: 'Shoulder Width', guide: 'Measure from shoulder point to shoulder point' },
];

export const NURSES_SCRUBS_MEASUREMENTS = [
  { key: 'chest', label: 'Chest', guide: 'Measure around the fullest part of your chest' },
  { key: 'waist', label: 'Waist', guide: 'Measure around your natural waistline' },
  { key: 'inseam', label: 'Inseam', guide: 'Measure from crotch to ankle for pants' },
  { key: 'topLength', label: 'Top Length', guide: 'Measure from shoulder to desired top hem' },
  { key: 'preferredFit', label: 'Preferred Fit', guide: 'Select: Relaxed or Fitted' },
];

export const getMeasurementFields = (garmentType: GarmentType) => {
  switch (garmentType) {
    case 'SUIT':
      return SUIT_MEASUREMENTS;
    case 'AFRICAN_PRINT':
      return AFRICAN_PRINT_MEASUREMENTS;
    case 'NURSES_SCRUBS':
      return NURSES_SCRUBS_MEASUREMENTS;
    default:
      return [];
  }
};
