import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, quantity = 1) => {
    setCart(prev => {
      const key = `${product._id}-${size}`;
      const existing = prev.find(i => `${i._id}-${i.selectedSize}` === key);
      if (existing) {
        return prev.map(i =>
          `${i._id}-${i.selectedSize}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        _id: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images?.[0] || '',
        school: product.school,
        selectedSize: size,
        quantity,
      }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(i => !(i._id === id && i.selectedSize === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) return removeFromCart(id, size);
    setCart(prev => prev.map(i =>
      i._id === id && i.selectedSize === size ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
