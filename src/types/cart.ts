import { Service } from './service';
import { MeasurementProfile } from './measurement';

export interface CartItem {
  id: string;
  service: Service;
  measurementProfileId?: string;
  measurementProfile?: MeasurementProfile;
  customizationData?: {
    fabric?: string;
    color?: string;
    designFileUrl?: string;
    specialInstructions?: string;
  };
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CheckoutFormData {
  // Customer Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Delivery Info
  deliveryAddress: string;
  city: string;
  postalCode?: string;

  // Notes
  customerNotes?: string;
  tailorNotes?: string;

  // Payment
  paymentMethod: 'MOBILE_MONEY' | 'CASH_ON_DELIVERY';
  mobileMoneyNetwork?: 'MTN' | 'VODAFONE' | 'AIRTELTIGO';
  mobileMoneyPhone?: string;
}

export interface Order {
  orderNumber: string;
  items: CartItem[];
  customerInfo: CheckoutFormData;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'READY' | 'DELIVERED' | 'CANCELLED';
  isPaid: boolean;
  createdAt: string;
  paymentMethod: 'MOBILE_MONEY' | 'CASH_ON_DELIVERY';
  paymentDetails?: {
    mobileMoneyNetwork?: 'MTN' | 'VODAFONE' | 'AIRTELTIGO';
    mobileMoneyPhone?: string;
  };
}
