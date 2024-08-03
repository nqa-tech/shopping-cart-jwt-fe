const CART_STORAGE_KEY = 'shopping_cart';

export const saveCart = (cart) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const getCart = () => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
};
