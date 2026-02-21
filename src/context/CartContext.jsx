import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
    totalItems: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('khokharmart_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        // ❌ REMOVED console.log
      } catch (error) {
        // ❌ REMOVED console.error
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.items.length > 0 || cart.totalItems > 0) {
      localStorage.setItem('khokharmart_cart', JSON.stringify(cart));
      // ❌ REMOVED console.log
    } else {
      localStorage.removeItem('khokharmart_cart');
    }
  }, [cart]);

 const addToCart = (product) => {
  // ✅ MOVE TOAST OUTSIDE setCart to prevent render error
  const cleanName = product.name.split(' - ')[0].trim();
  
  setCart(prevCart => {
    const existingItem = prevCart.items.find(
      item => item._id === product._id && item.size === product.size
    );
    
    let updatedItems;
    if (existingItem) {
      updatedItems = prevCart.items.map(item =>
        item._id === product._id && item.size === product.size
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      );
    } else {
      updatedItems = [...prevCart.items, product];
    }

    const totalPrice = updatedItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    
    const totalItems = updatedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return {
      items: updatedItems,
      totalPrice,
      totalItems
    };
  });

  // ✅ TOAST AFTER setCart completes
  setTimeout(() => {
    toast.success(`${product.quantity} × ${cleanName} added to cart!`);
  }, 0);

  return { success: true };
};

  const removeFromCart = (productId, size) => {
  setCart(prevCart => {
    const updatedItems = prevCart.items.filter(
      item => !(item._id === productId && item.size === size)
    );
    
    const totalPrice = updatedItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    
    const totalItems = updatedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return {
      items: updatedItems,
      totalPrice,
      totalItems
    };
  });

  // ✅ MOVE TOAST OUTSIDE - runs ONCE after state updates
  setTimeout(() => {
    toast.error('Item removed from cart');
  }, 0);
};
  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId, size);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item._id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );
      
      const totalPrice = updatedItems.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      );
      
      const totalItems = updatedItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      return {
        items: updatedItems,
        totalPrice,
        totalItems
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalPrice: 0,
      totalItems: 0
    });
    localStorage.removeItem('khokharmart_cart');
    toast('Cart cleared');
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;