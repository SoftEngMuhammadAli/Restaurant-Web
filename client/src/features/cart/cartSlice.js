import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurant: JSON.parse(localStorage.getItem('cartRestaurant') || 'null'),
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
};

const saveCart = (items) => localStorage.setItem('cart', JSON.stringify(items));
const saveRestaurant = (restaurant) => localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { restaurant, item } = action.payload;
      if (restaurant && state.restaurant?._id !== restaurant._id) {
        state.items = [];
        state.restaurant = restaurant;
        saveRestaurant(restaurant);
      }
      const existing = state.items.find((row) => row.id === item.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...item, quantity: 1 });
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((row) => row.id === action.payload.id);
      if (!item) return;
      item.quantity = action.payload.quantity;
      if (item.quantity <= 0) state.items = state.items.filter((row) => row.id !== action.payload.id);
      if (!state.items.length) {
        state.restaurant = null;
        saveRestaurant(null);
      }
      saveCart(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((row) => row.id !== action.payload);
      if (!state.items.length) {
        state.restaurant = null;
        saveRestaurant(null);
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
      saveCart([]);
      saveRestaurant(null);
    },
  },
});

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartRestaurant = (state) => state.cart.restaurant;

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
