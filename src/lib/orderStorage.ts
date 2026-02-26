import { Order } from '@/types/cart';

const ORDERS_STORAGE_KEY = 'kingkart_orders';

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!stored) return [];

  try {
    const orders = JSON.parse(stored) as Order[];
    // Most recent first
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch {
    return [];
  }
};

export const getOrderByNumber = (orderNumber: string): Order | null => {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!stored) return null;

  try {
    const orders = JSON.parse(stored) as Order[];
    return orders.find((o) => o.orderNumber === orderNumber) ?? null;
  } catch {
    return null;
  }
};
