import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Bell, LogOut, MapPin, PackageCheck, Sparkles, UserRound } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useGetCustomerProfileQuery } from '../api/apiSlice.js';
import { logout } from '../features/auth/authSlice.js';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetCustomerProfileQuery();
  const panel = data?.data;
  const user = panel?.user;
  const addresses = panel?.addresses || [];
  const recentOrders = panel?.recentOrders || [];
  const stats = panel?.stats || {};

  const signOut = () => {
    dispatch(logout());
    navigate('/store');
  };

  if (isLoading) {
    return (
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8">
        <Skeleton className="h-28" />
        <Skeleton className="h-64" />
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Customer panel</p>
          <h1 className="text-3xl font-semibold tracking-normal">Welcome back, {user?.name || 'Customer'}</h1>
          <p className="text-sm text-muted-foreground">Track orders, manage addresses, and keep your preferences current.</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <Sparkles className="mb-3 h-5 w-5 text-accent" />
            <p className="text-sm text-muted-foreground">Loyalty points</p>
            <p className="mt-2 text-2xl font-semibold">{stats.loyaltyPoints || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <PackageCheck className="mb-3 h-5 w-5 text-sky-500" />
            <p className="text-sm text-muted-foreground">Recent orders</p>
            <p className="mt-2 text-2xl font-semibold">{stats.recentOrders || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <MapPin className="mb-3 h-5 w-5 text-amber-500" />
            <p className="text-sm text-muted-foreground">Saved addresses</p>
            <p className="mt-2 text-2xl font-semibold">{stats.savedAddresses || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Bell className="mb-3 h-5 w-5 text-rose-500" />
            <p className="text-sm text-muted-foreground">Unread alerts</p>
            <p className="mt-2 text-2xl font-semibold">{stats.unreadNotifications || 0}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between rounded-md bg-muted p-3">
                <span className="text-muted-foreground">Phone</span>
                <span>{user?.phone || 'Not added'}</span>
              </div>
              <div className="flex justify-between rounded-md bg-muted p-3">
                <span className="text-muted-foreground">Email status</span>
                <Badge color={user?.isEmailVerified ? 'green' : 'amber'}>
                  {user?.isEmailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">Edit profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent orders</CardTitle>
            <Link to="/account/orders" className="text-sm font-medium text-accent">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/account/orders/${order._id}`}
                  className="flex items-center justify-between rounded-md border p-3 transition hover:bg-muted"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.items?.length || 0} items · {order.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge color={order.status === 'COMPLETED' ? 'green' : 'blue'}>{order.status}</Badge>
                    <p className="mt-1 text-sm font-semibold">${(order.grandTotal || 0).toFixed(2)}</p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Saved addresses</CardTitle>
          <Button size="sm" variant="outline">Add address</Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
          ) : (
            addresses.map((address) => (
              <div key={address._id} className="rounded-md border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold">{address.label}</p>
                  {address.isDefault ? <Badge color="green">Default</Badge> : null}
                </div>
                <p className="text-sm text-muted-foreground">{address.line1}</p>
                {address.line2 ? <p className="text-sm text-muted-foreground">{address.line2}</p> : null}
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.postalCode}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
};
