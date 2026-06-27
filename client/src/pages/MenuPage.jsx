import { Search, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useCategoriesQuery, useMenuItemsQuery } from '../api/apiSlice.js';
import { addItem } from '../features/cart/cartSlice.js';

export const MenuPage = () => {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { data: categoriesData } = useCategoriesQuery();
  const { data: menuData } = useMenuItemsQuery({ available: true, category: category || undefined, search: search || undefined });
  const categories = categoriesData?.data || [];
  const items = useMemo(() => menuData?.data || [], [menuData]);

  const add = (item) => {
    dispatch(addItem({ id: item._id, name: item.name, price: item.price, imageUrl: item.imageUrl }));
    toast.success(`${item.name} added to cart`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold">Menu</h1>
        <p className="text-muted-foreground">Seasonal plates, generous mains, and drinks for every table.</p>
      </div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search dishes..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Button variant={!category ? 'default' : 'outline'} size="sm" onClick={() => setCategory('')}>All</Button>
          {categories.map((item) => (
            <Button key={item._id} variant={category === item._id ? 'default' : 'outline'} size="sm" onClick={() => setCategory(item._id)}>{item.name}</Button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
                {item.isFeatured ? <Badge>Featured</Badge> : null}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold">${item.price.toFixed(2)}</span>
                <Button size="sm" onClick={() => add(item)}><Plus className="h-4 w-4" /> Add</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
