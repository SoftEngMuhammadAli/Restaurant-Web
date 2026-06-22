import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { StorefrontLayout } from '../layouts/StorefrontLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { LoginPage } from '../features/auth/LoginPage.jsx';
import { RegisterPage } from '../features/auth/RegisterPage.jsx';
import { CustomerRegisterPage } from '../features/auth/CustomerRegisterPage.jsx';

const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage.jsx').then((m) => ({ default: m.DashboardPage })),
);
const MenuManagementPage = lazy(() =>
  import('../features/menu/MenuManagementPage.jsx').then((m) => ({
    default: m.MenuManagementPage,
  })),
);
const OrdersPage = lazy(() =>
  import('../features/orders/OrdersPage.jsx').then((m) => ({ default: m.OrdersPage })),
);
const TablesPage = lazy(() =>
  import('../features/tables/TablesPage.jsx').then((m) => ({ default: m.TablesPage })),
);
const ReservationsPage = lazy(() =>
  import('../features/reservations/ReservationsPage.jsx').then((m) => ({
    default: m.ReservationsPage,
  })),
);
const CustomersPage = lazy(() =>
  import('../features/customers/CustomersPage.jsx').then((m) => ({ default: m.CustomersPage })),
);
const AnalyticsPage = lazy(() =>
  import('../features/analytics/AnalyticsPage.jsx').then((m) => ({ default: m.AnalyticsPage })),
);
const SettingsPage = lazy(() =>
  import('../features/settings/SettingsPage.jsx').then((m) => ({ default: m.SettingsPage })),
);
const POSPage = lazy(() =>
  import('../features/pos/POSPage.jsx').then((m) => ({ default: m.POSPage })),
);
const KitchenDisplayPage = lazy(() =>
  import('../features/kitchen/KitchenDisplayPage.jsx').then((m) => ({
    default: m.KitchenDisplayPage,
  })),
);
const StorefrontPage = lazy(() =>
  import('../pages/StorefrontPage.jsx').then((m) => ({ default: m.StorefrontPage })),
);
const CartPage = lazy(() => import('../pages/CartPage.jsx').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() =>
  import('../pages/CheckoutPage.jsx').then((m) => ({ default: m.CheckoutPage })),
);
const ProfilePage = lazy(() =>
  import('../pages/ProfilePage.jsx').then((m) => ({ default: m.ProfilePage })),
);
const OrderTrackingPage = lazy(() =>
  import('../pages/OrderTrackingPage.jsx').then((m) => ({ default: m.OrderTrackingPage })),
);

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/customer" element={<CustomerRegisterPage />} />
      </Route>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Navigate to="/store" replace />} />
        <Route path="/store" element={<StorefrontPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<StorefrontLayout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/orders" element={<OrderTrackingPage />} />
          <Route path="/account/orders/:id" element={<OrderTrackingPage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/app/menu" element={<MenuManagementPage />} />
          <Route path="/app/orders" element={<OrdersPage />} />
          <Route path="/app/tables" element={<TablesPage />} />
          <Route path="/app/reservations" element={<ReservationsPage />} />
          <Route path="/app/customers" element={<CustomersPage />} />
          <Route path="/app/analytics" element={<AnalyticsPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />
          <Route path="/app/pos" element={<POSPage />} />
          <Route path="/app/kitchen" element={<KitchenDisplayPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/store" replace />} />
    </Routes>
  </BrowserRouter>
);
