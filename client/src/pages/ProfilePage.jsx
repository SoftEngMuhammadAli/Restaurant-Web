import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useLogoutMutation, useProfileQuery } from '../api/apiSlice.js';
import { logout as logoutLocal } from '../features/auth/authSlice.js';

export const ProfilePage = () => {
  const { data, isLoading } = useProfileQuery();
  const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = data?.data;

  if (isLoading) return <section className="p-6">Loading profile...</section>;

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      toast.error('Session ended locally. Server logout could not be confirmed.');
    } finally {
      dispatch(logoutLocal());
      navigate('/login');
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-5 px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Your profile</h1>
          <p className="text-muted-foreground">Orders, saved addresses, and restaurant updates.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card><CardContent><p className="text-xl font-semibold">{profile?.user?.name}</p><p className="text-sm text-muted-foreground">{profile?.user?.email}</p><p className="mt-2 text-sm">{profile?.user?.phone}</p></CardContent></Card>
        <Card><CardContent><h2 className="mb-3 font-semibold">Recent orders</h2><div className="space-y-3">{(profile?.orders || []).map((order) => <Link key={order._id} to={`/orders/${order._id}`} className="flex justify-between rounded-md border p-3 hover:bg-muted"><span>{order.restaurant?.name || order.orderNumber}</span><Badge>{order.status}</Badge></Link>)}</div></CardContent></Card>
      </div>
      <Card><CardContent><h2 className="mb-3 font-semibold">Saved addresses</h2><div className="grid gap-3 md:grid-cols-3">{(profile?.addresses || []).map((address) => <div key={address._id} className="rounded-md border p-3"><p className="font-medium">{address.label}</p><p className="text-sm text-muted-foreground">{address.line1}</p><p className="text-sm text-muted-foreground">{address.city}, {address.state}</p></div>)}</div></CardContent></Card>
    </section>
  );
};
