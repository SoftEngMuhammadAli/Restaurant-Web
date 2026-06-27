import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, Search, ShoppingBag, Store, UserRound } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button.jsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';
import { useLogoutMutation } from '../api/apiSlice.js';
import { logout as logoutLocal } from '../features/auth/authSlice.js';

export const PublicLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const [logoutRequest, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await logoutRequest().unwrap();
      toast.success('Logged out');
    } catch {
      toast.error('Logged out locally');
    } finally {
      dispatch(logoutLocal());
      navigate('/');
    }
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              FoodHub
              <span className="block text-xs font-medium text-muted-foreground">Restaurant delivery</span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
            <Link to="/restaurants" className="flex w-full max-w-xl items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm hover:bg-muted">
              <Search className="h-4 w-4" />
              Search restaurants, dishes, and cuisines
            </Link>
          </div>

          <nav className="flex items-center gap-2">
            <Link className="hidden rounded-md px-3 py-2 text-sm hover:bg-muted sm:inline-flex" to="/restaurants">
              <Store className="mr-2 h-4 w-4" />
              Restaurants
            </Link>
            <Link className="relative rounded-md border px-3 py-2 text-sm hover:bg-muted" to="/cart" aria-label="Cart">
              <ShoppingBag className="h-4 w-4" />
              {cartCount ? <span className="absolute -right-2 -top-2 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{cartCount}</span> : null}
            </Link>
            {user ? (
              <>
                <Link className="rounded-md border px-3 py-2 text-sm hover:bg-muted" to="/profile" aria-label="Profile">
                  <UserRound className="h-4 w-4" />
                </Link>
                <Button variant="ghost" size="icon" onClick={logout} disabled={isLoading} aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <Outlet />
    </main>
  );
};
