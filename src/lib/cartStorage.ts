import { CartItem, Cart, Order } from '@/types/cart';

const CART_STORAGE_KEY = 'kingkart_cart';
const ORDERS_STORAGE_KEY = 'kingkart_orders';

// Get cart from localStorage
export const getCart = (): Cart => {
  if (typeof window === 'undefined') return { items: [], total: 0 };

  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) return { items: [], total: 0 };

  return JSON.parse(stored);
};

// Save cart to localStorage
export const saveCart = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

// Calculate cart total
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Add item to cart
export const addToCart = (item: Omit<CartItem, 'id'>): Cart => {
  const cart = getCart();

  const newItem: CartItem = {
    ...item,
    id: `cart-item-${Date.now()}`,
  };

  cart.items.push(newItem);
  cart.total = calculateCartTotal(cart.items);

  saveCart(cart);
  return cart;
};

// Update cart item quantity
export const updateCartItemQuantity = (itemId: string, quantity: number): Cart => {
  const cart = getCart();

  const item = cart.items.find(i => i.id === itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }

  cart.total = calculateCartTotal(cart.items);
  saveCart(cart);
  return cart;
};

// Remove item from cart
export const removeFromCart = (itemId: string): Cart => {
  const cart = getCart();

  cart.items = cart.items.filter(item => item.id !== itemId);
  cart.total = calculateCartTotal(cart.items);

  saveCart(cart);
  return cart;
};

// Clear cart
export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_STORAGE_KEY);
};

// Order Management
export const saveOrder = (order: Order): void => {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  const orders: Order[] = stored ? JSON.parse(stored) : [];

  orders.push(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getOrderByNumber = (orderNumber: string): Order | null => {
  const orders = getOrders();
  return orders.find(order => order.orderNumber === orderNumber) || null;
};

// Generate order number
export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `KK-${year}-${timestamp}`;
};
