import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
  });

  const addItem = (item) => {
    const existing = cart.items.find(i => i.foodName === item.foodName);
    let updatedItems;
    if (existing) {
      updatedItems = cart.items.map(i =>
        i.foodName === item.foodName
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedItems = [...cart.items, item];
    }

    const total = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    setCart({ items: updatedItems, totalPrice: total });
  };

  const updateItemQuantity = (foodName, quantity) => {
    const updatedItems = cart.items.map(i =>
      i.foodName === foodName ? { ...i, quantity } : i
    );
    const total = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    setCart({ items: updatedItems, totalPrice: total });
  };

  const clearCart = () => setCart({ items: [], totalPrice: 0 });

  return (
    <CartContext.Provider value={{ cart, addItem, updateItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
