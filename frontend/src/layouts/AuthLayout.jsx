import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';

export const AuthLayout = () => (
  <main className="grid min-h-screen bg-background lg:grid-cols-[1.1fr_0.9fr]">
    <section className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">RestaurantOS</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Run service from one calm command center.</h1>
          </div>
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </section>
    <section className="hidden bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center lg:block">
      <div className="h-full bg-slate-950/35" />
    </section>
  </main>
);
