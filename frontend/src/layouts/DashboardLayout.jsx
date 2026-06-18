import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart3, CalendarDays, ChefHat, CreditCard, LayoutDashboard, LogOut, Menu, Settings, ShoppingBag, Table2, Users } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';
import { logout } from '../features/auth/authSlice.js';
import { cn } from '../utils/cn.js';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/menu', label: 'Menu', icon: Menu },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/tables', label: 'Tables', icon: Table2 },
  { to: '/reservations', label: 'Reservations', icon: CalendarDays },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/pos', label: 'POS', icon: CreditCard },
  { to: '/kitchen', label: 'Kitchen', icon: ChefHat },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const signOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card px-3 py-4 lg:block">
        <div className="mb-6 px-3">
          <p className="text-lg font-semibold">RestaurantOS</p>
          <p className="text-xs text-muted-foreground">{user?.role || 'Workspace'}</p>
        </div>
        <nav className="grid gap-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground',
                  isActive && 'bg-muted text-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-6">
          <div>
            <p className="text-sm font-semibold">Demo Bistro</p>
            <p className="text-xs text-muted-foreground">Live operations workspace</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card p-1 lg:hidden">
          {links.slice(0, 5).map((item) => (
            <NavLink key={item.to} to={item.to} className="grid place-items-center rounded-md py-2 text-xs text-muted-foreground">
              <item.icon className="h-4 w-4" />
              <span className="mt-1">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
