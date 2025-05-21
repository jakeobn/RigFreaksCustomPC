import React, { createContext, useContext, useState, useEffect } from 'react';

// Define cart item types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  cart: {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
  };
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeCartItem: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
  }>({
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const recalculateCart = (items: CartItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      items,
      totalQuantity,
      totalPrice
    };
  };

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.items.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        return recalculateCart(updatedItems);
      } else {
        // New item, add to cart
        const updatedItems = [
          ...currentCart.items,
          { ...newItem, quantity }
        ];
        
        return recalculateCart(updatedItems);
      }
    });
    
    // Open cart when adding item
    openCart();
  };

  const removeCartItem = (itemId: string) => {
    setCart(currentCart => {
      const updatedItems = currentCart.items.filter(item => item.id !== itemId);
      return recalculateCart(updatedItems);
    });
  };

  const updateCartItem = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeCartItem(itemId);
      return;
    }
    
    setCart(currentCart => {
      const updatedItems = currentCart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      
      return recalculateCart(updatedItems);
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalQuantity: 0,
      totalPrice: 0
    });
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      removeCartItem,
      updateCartItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Create custom hook for using cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}