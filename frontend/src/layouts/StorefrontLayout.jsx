import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, UserRound } from 'lucide-react';
import { useSelector } from 'react-redux';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';

export const StorefrontLayout = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-8">
        <Link to="/store" className="font-semibold">Demo Bistro</Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/cart" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted">
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Link>
          <Link to={user ? '/account' : '/login'} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted">
            <UserRound className="h-4 w-4" />
            {user ? 'Account' : 'Login'}
          </Link>
        </div>
      </header>
      <Outlet />
    </main>
  );
};
