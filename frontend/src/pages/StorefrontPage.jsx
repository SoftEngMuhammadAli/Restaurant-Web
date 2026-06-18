import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { menuItems } from '../app/demoData.js';

export const StorefrontPage = () => (
  <div>
    <section className="min-h-[58vh] bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center">
      <div className="flex min-h-[58vh] items-end bg-slate-950/45 px-4 pb-10 text-white md:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-normal md:text-6xl">Demo Bistro</h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">Seasonal comfort food, fast pickup, reliable delivery, and a dining room that knows your favorites.</p>
        </div>
      </div>
    </section>
    <section className="px-4 py-8 md:px-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img src={item.image} alt={item.name} className="aspect-[4/3] w-full object-cover" />
            <CardContent className="p-4">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
              <div className="mt-4 flex items-center justify-between"><span className="font-semibold">${item.price}</span><Button size="sm"><Plus className="h-4 w-4" /> Add</Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  </div>
);
