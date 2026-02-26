import { Order, OrderStatus } from '@/types/cart';

const ORDERS_STORAGE_KEY = 'kingkart_orders';

export const getAllOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Order[];
  } catch {
    return [];
  }
};

export const getOrderByNumber = (orderNumber: string): Order | null => {
  const orders = getAllOrders();
  return orders.find((o) => o.orderNumber === orderNumber) ?? null;
};

export const updateOrderStatus = (
  orderNumber: string,
  newStatus: OrderStatus,
): void => {
  if (typeof window === 'undefined') return;

  const orders = getAllOrders();
  const index = orders.findIndex((o) => o.orderNumber === orderNumber);
  if (index === -1) return;

  orders[index] = { ...orders[index], status: newStatus };
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};
