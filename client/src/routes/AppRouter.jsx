import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

const HomePage = lazy(() => import('../pages/HomePage.jsx').then((m) => ({ default: m.HomePage })));
const RestaurantListPage = lazy(() => import('../pages/RestaurantListPage.jsx').then((m) => ({ default: m.RestaurantListPage })));
const RestaurantPage = lazy(() => import('../pages/RestaurantPage.jsx').then((m) => ({ default: m.RestaurantPage })));
const CartPage = lazy(() => import('../pages/CartPage.jsx').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage.jsx').then((m) => ({ default: m.CheckoutPage })));
const ReservePage = lazy(() => import('../pages/ReservePage.jsx').then((m) => ({ default: m.ReservePage })));
const LoginPage = lazy(() => import('../pages/LoginPage.jsx').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx').then((m) => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage.jsx').then((m) => ({ default: m.ProfilePage })));
const OrderTrackingPage = lazy(() => import('../pages/OrderTrackingPage.jsx').then((m) => ({ default: m.OrderTrackingPage })));
const DashboardPage = lazy(() => import('../pages/staff/DashboardPage.jsx').then((m) => ({ default: m.DashboardPage })));
const OrdersPage = lazy(() => import('../pages/staff/OrdersPage.jsx').then((m) => ({ default: m.OrdersPage })));
const KitchenPage = lazy(() => import('../pages/staff/KitchenPage.jsx').then((m) => ({ default: m.KitchenPage })));
const POSPage = lazy(() => import('../pages/staff/SimpleStaffPages.jsx').then((m) => ({ default: m.POSPage })));
const TablesPage = lazy(() => import('../pages/staff/SimpleStaffPages.jsx').then((m) => ({ default: m.TablesPage })));
const CustomersPage = lazy(() => import('../pages/staff/SimpleStaffPages.jsx').then((m) => ({ default: m.CustomersPage })));
const ReservationsPage = lazy(() => import('../pages/staff/SimpleStaffPages.jsx').then((m) => ({ default: m.ReservationsPage })));
const AnalyticsPage = lazy(() => import('../pages/staff/SimpleStaffPages.jsx').then((m) => ({ default: m.AnalyticsPage })));

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/menu" element={<Navigate to="/restaurants" replace />} />
        <Route path="/restaurants" element={<RestaurantListPage />} />
        <Route path="/restaurants/:slug" element={<RestaurantPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/reserve" element={<ReservePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrderTrackingPage />} />
          <Route path="/orders/:id" element={<OrderTrackingPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute staff />}>
        <Route element={<AdminLayout />}>
          <Route path="/staff" element={<DashboardPage />} />
          <Route path="/staff/orders" element={<OrdersPage />} />
          <Route path="/staff/kitchen" element={<KitchenPage />} />
          <Route path="/staff/pos" element={<POSPage />} />
          <Route path="/staff/tables" element={<TablesPage />} />
          <Route path="/staff/customers" element={<CustomersPage />} />
          <Route path="/staff/reservations" element={<ReservationsPage />} />
          <Route path="/staff/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
