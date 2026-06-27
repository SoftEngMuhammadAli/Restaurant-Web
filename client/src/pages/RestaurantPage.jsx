import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, Plus, Search, Star, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useCategoriesQuery, useRestaurantMenuQuery } from '../api/apiSlice.js';
import { addItem } from '../features/cart/cartSlice.js';

const formatCurrency = (value = 0) => `Rs. ${Number(value).toLocaleString('en-PK')}`;

export const RestaurantPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { data: categoriesData } = useCategoriesQuery();
  const { data, isLoading } = useRestaurantMenuQuery({ slug, category: category || undefined, search: search || undefined });
  const restaurant = data?.data?.restaurant;
  const items = useMemo(() => data?.data?.items || [], [data]);
  const categories = categoriesData?.data || [];

  const add = (item) => {
    dispatch(addItem({
      restaurant: restaurant ? {
        _id: restaurant._id,
        name: restaurant.name,
        slug: restaurant.slug,
        deliveryFee: restaurant.deliveryFee,
        minimumOrder: restaurant.minimumOrder,
      } : null,
      item: { id: item._id, name: item.name, price: item.price, imageUrl: item.imageUrl },
    }));
    toast.success(`${item.name} added to cart`);
  };

  if (isLoading) return <section className="mx-auto max-w-7xl px-4 py-8"><Skeleton className="h-96" /></section>;
  if (!restaurant) return <section className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-3xl font-semibold">Restaurant not found</h1></section>;

  return (
    <section>
      <div className="relative min-h-[360px] overflow-hidden bg-[#24110d] text-orange-50">
        <img src={restaurant.coverUrl} alt={restaurant.name} className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#24110d] via-[#24110d]/55 to-transparent" />
        <div className="relative mx-auto flex min-h-[360px] max-w-7xl items-end px-4 py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end">
            <img src={restaurant.logoUrl} alt="" className="h-24 w-24 rounded-md border-4 border-orange-50 object-cover shadow-xl" />
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                {restaurant.tags?.map((tag) => <Badge key={tag} color="amber">{tag}</Badge>)}
              </div>
              <h1 className="text-4xl font-semibold md:text-6xl">{restaurant.name}</h1>
              <p className="mt-2 max-w-2xl text-orange-50/82">{restaurant.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-orange-50/85">
                <span><Star className="mr-1 inline h-4 w-4 fill-amber-400 text-amber-400" />{restaurant.rating} ({restaurant.reviewCount}+)</span>
                <span><Clock className="mr-1 inline h-4 w-4" />{restaurant.deliveryTime}</span>
                <span><Truck className="mr-1 inline h-4 w-4" />{formatCurrency(restaurant.deliveryFee)}</span>
                <span><MapPin className="mr-1 inline h-4 w-4" />{restaurant.address?.area}, {restaurant.address?.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 border-b bg-background/94 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder={`Search ${restaurant.name}`} value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button variant={!category ? 'default' : 'outline'} size="sm" onClick={() => setCategory('')}>All</Button>
            {categories.map((item) => (
              <Button key={item._id} variant={category === item._id ? 'default' : 'outline'} size="sm" onClick={() => setCategory(item._id)}>{item.name}</Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <div className="grid grid-cols-[1fr_128px] gap-3 p-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold">{item.name}</h2>
                  {item.isFeatured ? <Badge>Top</Badge> : null}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold">{formatCurrency(item.price)}</span>
                  <Button size="sm" onClick={() => add(item)}><Plus className="h-4 w-4" /> Add</Button>
                </div>
              </div>
              <img src={item.imageUrl} alt={item.name} className="h-32 w-32 rounded-md object-cover" loading="lazy" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
