import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { StorefrontLayout } from '../layouts/StorefrontLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { RegisterPage } from '../features/auth/RegisterPage.jsx';

const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage.jsx').then((m) => ({ default: m.DashboardPage })));
const MenuManagementPage = lazy(() => import('../features/menu/MenuManagementPage.jsx').then((m) => ({ default: m.MenuManagementPage })));
const OrdersPage = lazy(() => import('../features/orders/OrdersPage.jsx').then((m) => ({ default: m.OrdersPage })));
const TablesPage = lazy(() => import('../features/tables/TablesPage.jsx').then((m) => ({ default: m.TablesPage })));
const ReservationsPage = lazy(() => import('../features/reservations/ReservationsPage.jsx').then((m) => ({ default: m.ReservationsPage })));
const CustomersPage = lazy(() => import('../features/customers/CustomersPage.jsx').then((m) => ({ default: m.CustomersPage })));
const AnalyticsPage = lazy(() => import('../features/analytics/AnalyticsPage.jsx').then((m) => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage.jsx').then((m) => ({ default: m.SettingsPage })));
const POSPage = lazy(() => import('../features/pos/POSPage.jsx').then((m) => ({ default: m.POSPage })));
const KitchenDisplayPage = lazy(() => import('../features/kitchen/KitchenDisplayPage.jsx').then((m) => ({ default: m.KitchenDisplayPage })));
const StorefrontPage = lazy(() => import('../pages/StorefrontPage.jsx').then((m) => ({ default: m.StorefrontPage })));
const CartPage = lazy(() => import('../pages/CartPage.jsx').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage.jsx').then((m) => ({ default: m.CheckoutPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage.jsx').then((m) => ({ default: m.ProfilePage })));

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<StorefrontLayout />}>
        <Route path="/store" element={<StorefrontPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/menu" element={<MenuManagementPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/kitchen" element={<KitchenDisplayPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
