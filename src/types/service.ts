export type ServiceCategory =
  | 'SUIT'
  | 'AFRICAN_PRINT'
  | 'NURSES_SCRUBS'
  | 'EMBROIDERY'
  | 'TSHIRT_CUSTOMIZATION';

export type PricingType = 'FIXED' | 'STARTING_FROM';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  fullDescription: string;
  basePrice: number;
  pricingType: PricingType;
  requiresMeasurements: boolean;
  imageUrls: string[];
  features: string[];
  turnaroundTime: string;
}

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  SUIT: 'Custom Suits',
  AFRICAN_PRINT: 'African Prints',
  NURSES_SCRUBS: "Nurses' Scrubs",
  EMBROIDERY: 'Embroidery',
  TSHIRT_CUSTOMIZATION: 'T-Shirt Customization',
};

export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  SUIT: 'bg-blue-100 text-blue-800',
  AFRICAN_PRINT: 'bg-purple-100 text-purple-800',
  NURSES_SCRUBS: 'bg-green-100 text-green-800',
  EMBROIDERY: 'bg-pink-100 text-pink-800',
  TSHIRT_CUSTOMIZATION: 'bg-orange-100 text-orange-800',
};
