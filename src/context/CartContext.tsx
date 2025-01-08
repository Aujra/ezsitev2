'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  type: string;  // Add type field
  name: string;
  price: number;
  quantity: number;
  days?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    setIsLoading(true);
    await fetchCartItems();
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const addItem = async (newItem: CartItem) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newItem.type,     // Ensure type is included
          name: newItem.name,
          price: newItem.price,
          quantity: newItem.quantity,
          days: newItem.days
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add item');

      setItems(data.items || []);
      setIsLoading(false);
      setIsOpen(true); // Open cart after adding item
    } catch (error) {
      console.error('Error adding item:', error);
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      await refreshCart(); // Refresh cart after removing item
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to clear cart');
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const total = items.reduce((sum, item) => {
    // All game-time items should use their price directly (which is already squared)
    if (item.type === 'game-time') {
      return sum + item.price;
    }
    // For other items, multiply price by quantity
    return sum + (item.price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      total,
      isLoading,
      refreshCart,
      isOpen,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
