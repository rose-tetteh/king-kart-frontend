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

export type OrderStatus =
  | 'RECEIVED'
  | 'IN_PROGRESS'
  | 'READY_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: 'Received',
  IN_PROGRESS: 'In Progress',
  READY_FOR_DELIVERY: 'Ready for Delivery',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export interface Order {
  orderNumber: string;
  items: CartItem[];
  customerInfo: CheckoutFormData;
  total: number;
  status: OrderStatus;
  isPaid: boolean;
  createdAt: string;
  paymentMethod: 'MOBILE_MONEY' | 'CASH_ON_DELIVERY';
  paymentDetails?: {
    mobileMoneyNetwork?: 'MTN' | 'VODAFONE' | 'AIRTELTIGO';
    mobileMoneyPhone?: string;
  };
}
