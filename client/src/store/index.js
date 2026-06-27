import { configureStore } from '@reduxjs/toolkit';
import { api } from '../api/apiSlice.js';
import { authReducer } from '../features/auth/authSlice.js';
import { cartReducer } from '../features/cart/cartSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});
