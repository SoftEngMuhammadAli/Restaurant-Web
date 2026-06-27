import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Auth', 'Marketplace', 'Menu', 'Orders', 'Tables', 'Reservations', 'Dashboard', 'Profile'],
  endpoints: (builder) => ({
    marketplaceHome: builder.query({ query: () => '/menu/home', providesTags: ['Marketplace'] }),
    promotions: builder.query({ query: (params = {}) => ({ url: '/menu/promotions', params }), providesTags: ['Marketplace'] }),
    restaurants: builder.query({ query: (params = {}) => ({ url: '/menu/restaurants', params }), providesTags: ['Marketplace'] }),
    restaurant: builder.query({ query: (slug) => `/menu/restaurants/${slug}`, providesTags: ['Marketplace'] }),
    restaurantMenu: builder.query({
      query: ({ slug, ...params }) => ({ url: `/menu/restaurants/${slug}/menu`, params }),
      providesTags: ['Menu'],
    }),
    restaurantInfo: builder.query({ query: () => '/restaurant/info' }),
    categories: builder.query({ query: () => '/menu/categories', providesTags: ['Menu'] }),
    menuItems: builder.query({ query: (params = {}) => ({ url: '/menu/items', params }), providesTags: ['Menu'] }),
    reviews: builder.query({ query: () => '/restaurant/reviews' }),

    login: builder.mutation({ query: (body) => ({ url: '/auth/login', method: 'POST', body }) }),
    register: builder.mutation({ query: (body) => ({ url: '/auth/register', method: 'POST', body }) }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth', 'Profile'],
    }),
    me: builder.query({ query: () => '/auth/me', providesTags: ['Auth'] }),

    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders', 'Dashboard'],
    }),
    orders: builder.query({ query: (params = {}) => ({ url: '/orders', params }), providesTags: ['Orders'] }),
    order: builder.query({ query: (id) => `/orders/${id}`, providesTags: ['Orders'] }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/orders/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Orders', 'Dashboard'],
    }),
    payOrder: builder.mutation({
      query: ({ id, body }) => ({ url: `/orders/${id}/pay`, method: 'POST', body }),
      invalidatesTags: ['Orders', 'Dashboard'],
    }),

    dashboard: builder.query({ query: () => '/restaurant/dashboard', providesTags: ['Dashboard'] }),
    tables: builder.query({ query: () => '/restaurant/tables', providesTags: ['Tables'] }),
    updateTableStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/restaurant/tables/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Tables', 'Dashboard'],
    }),
    reservations: builder.query({ query: () => '/restaurant/reservations', providesTags: ['Reservations'] }),
    createReservation: builder.mutation({
      query: (body) => ({ url: '/restaurant/reservations', method: 'POST', body }),
      invalidatesTags: ['Reservations'],
    }),
    customers: builder.query({ query: () => '/restaurant/customers' }),
    profile: builder.query({ query: () => '/restaurant/profile', providesTags: ['Profile'] }),
    addAddress: builder.mutation({
      query: (body) => ({ url: '/restaurant/profile/addresses', method: 'POST', body }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useMarketplaceHomeQuery,
  usePromotionsQuery,
  useRestaurantsQuery,
  useRestaurantQuery,
  useRestaurantMenuQuery,
  useRestaurantInfoQuery,
  useCategoriesQuery,
  useMenuItemsQuery,
  useReviewsQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeQuery,
  useCreateOrderMutation,
  useOrdersQuery,
  useOrderQuery,
  useUpdateOrderStatusMutation,
  usePayOrderMutation,
  useDashboardQuery,
  useTablesQuery,
  useUpdateTableStatusMutation,
  useReservationsQuery,
  useCreateReservationMutation,
  useCustomersQuery,
  useProfileQuery,
  useAddAddressMutation,
} = api;
