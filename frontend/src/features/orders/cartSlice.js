import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product } = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...product,
          price: product.basePrice ?? product.price ?? 0,
          image: product.imageUrl || product.image,
          quantity: 1,
        });
      }
      cartSlice.caseReducers.updateTotal(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      cartSlice.caseReducers.updateTotal(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item._id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      cartSlice.caseReducers.updateTotal(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },

    updateTotal: (state) => {
      state.total = state.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
