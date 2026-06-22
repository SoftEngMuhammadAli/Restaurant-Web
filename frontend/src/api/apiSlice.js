import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from './http.js';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Auth',
    'Dashboard',
    'Categories',
    'MenuItems',
    'Tables',
    'Reservations',
    'Orders',
    'Customers',
    'Notifications',
    'categories',
    'menu-items',
    'tables',
    'reservations',
    'orders',
    'customers',
    'reviews',
    'notifications',
    'addons',
    'variants',
  ],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    dashboard: builder.query({
      query: () => '/analytics/dashboard',
      providesTags: ['Dashboard'],
    }),
    list: builder.query({
      query: ({ resource, params }) => ({ url: `/${resource}`, params }),
      providesTags: (_result, _error, arg) => [arg.resource],
    }),
    create: builder.mutation({
      query: ({ resource, body }) => ({ url: `/${resource}`, method: 'POST', body }),
      invalidatesTags: (_result, _error, arg) => [arg.resource, 'Dashboard'],
    }),
    update: builder.mutation({
      query: ({ resource, id, body }) => ({ url: `/${resource}/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, arg) => [arg.resource, 'Dashboard'],
    }),
    remove: builder.mutation({
      query: ({ resource, id }) => ({ url: `/${resource}/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, arg) => [arg.resource, 'Dashboard'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders', 'Dashboard'],
    }),
    updateTableStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tables/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Tables', 'Dashboard'],
    }),
    // Customer/Storefront API endpoints
    getMenuItems: builder.query({
      query: (params = {}) => ({ url: '/menu-items', params }),
      providesTags: ['MenuItems'],
    }),
    getCategories: builder.query({
      query: (params = {}) => ({ url: '/categories', params }),
      providesTags: ['Categories'],
    }),
    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
    getMyOrders: builder.query({
      query: (params = {}) => ({ url: '/orders', params }),
      providesTags: ['Orders'],
    }),
    getOrderDetail: builder.query({
      query: (id) => ({ url: `/orders/${id}` }),
      providesTags: (_result, _error, id) => ['Orders', { type: 'Orders', id }],
    }),
    getCustomerProfile: builder.query({
      query: () => ({ url: '/me' }),
      providesTags: ['Customers'],
    }),
    updateCustomerProfile: builder.mutation({
      query: (body) => ({ url: '/me', method: 'PUT', body }),
      invalidatesTags: ['Customers'],
    }),
    getMyAddresses: builder.query({
      query: () => ({ url: '/me/addresses' }),
      providesTags: ['Customers'],
    }),
    addAddress: builder.mutation({
      query: (body) => ({ url: '/me/addresses', method: 'POST', body }),
      invalidatesTags: ['Customers'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useDashboardQuery,
  useListQuery,
  useCreateMutation,
  useUpdateMutation,
  useRemoveMutation,
  useUpdateOrderStatusMutation,
  useUpdateTableStatusMutation,
  useGetMenuItemsQuery,
  useGetCategoriesQuery,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailQuery,
  useGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useGetMyAddressesQuery,
  useAddAddressMutation,
} = api;
