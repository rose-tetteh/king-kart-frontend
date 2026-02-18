'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem } from '@/types/cart';
import {
  getCart,
  addToCart as addToCartStorage,
  updateCartItemQuantity as updateQuantityStorage,
  removeFromCart as removeFromCartStorage,
  clearCart as clearCartStorage,
} from '@/lib/cartStorage';

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    // Load cart from localStorage on mount
    const storedCart = getCart();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(storedCart);
  }, []);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const updatedCart = addToCartStorage(item);
    setCart(updatedCart);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = updateQuantityStorage(itemId, quantity);
    setCart(updatedCart);
  };

  const removeItem = (itemId: string) => {
    const updatedCart = removeFromCartStorage(itemId);
    setCart(updatedCart);
  };

  const clearCart = () => {
    clearCartStorage();
    setCart({ items: [], total: 0 });
  };

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
