import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BarChart3, ChefHat, LayoutDashboard, LogOut, MenuSquare, ShoppingBag, Table2, UsersRound } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';
import { useLogoutMutation } from '../api/apiSlice.js';
import { logout as logoutLocal } from '../features/auth/authSlice.js';
import { cn } from '../utils/cn.js';

const links = [
  { to: '/staff', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/staff/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/staff/kitchen', label: 'Kitchen', icon: ChefHat },
  { to: '/staff/pos', label: 'POS', icon: MenuSquare },
  { to: '/staff/tables', label: 'Tables', icon: Table2 },
  { to: '/staff/customers', label: 'Customers', icon: UsersRound },
  { to: '/staff/analytics', label: 'Analytics', icon: BarChart3 },
];

export const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();

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
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card p-3 lg:block">
        <div className="mb-6 p-3">
          <p className="font-semibold">Velora Staff</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <nav className="grid gap-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground', isActive && 'bg-muted text-foreground')}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur">
          <div>
            <p className="text-sm font-semibold">Restaurant operations</p>
            <p className="text-xs text-muted-foreground">Orders, kitchen, floor, and guests</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoggingOut} aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
