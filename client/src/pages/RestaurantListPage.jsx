import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Search, Star, Truck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../components/ui/Badge.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useCategoriesQuery, useRestaurantsQuery } from '../api/apiSlice.js';

const formatCurrency = (value = 0) => `Rs. ${Number(value).toLocaleString('en-PK')}`;

export const RestaurantListPage = () => {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const cuisine = params.get('cuisine') || '';
  const { data: categoryData } = useCategoriesQuery();
  const { data, isLoading } = useRestaurantsQuery({ search: search || undefined, cuisine: cuisine || undefined });
  const restaurants = data?.data ?? [];
  const categories = categoryData?.data || [];

  const featured = restaurants.filter((restaurant) => restaurant.isFeatured);

  const setCuisine = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set('cuisine', value);
    else next.delete('cuisine');
    setParams(next);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 rounded-md bg-[#fff1e8] p-5 text-[#25120c] dark:bg-[#30160f] dark:text-orange-50 lg:grid-cols-[1fr_360px] lg:p-8">
        <div>
          <Badge color="amber">Restaurants near you</Badge>
          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Order from any restaurant</h1>
          <p className="mt-3 max-w-2xl text-[#6f4635] dark:text-orange-50/75">
            Search by cuisine, deal, or restaurant name. Choose one kitchen, add dishes, and checkout with a clean order flow.
          </p>
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="bg-background pl-9" placeholder="Search restaurants..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
        </div>
        <div className="hidden overflow-hidden rounded-md lg:block">
          <img src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=85" alt="" className="h-full min-h-64 w-full object-cover" />
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <Button variant={!cuisine ? 'default' : 'outline'} size="sm" onClick={() => setCuisine('')}>All</Button>
        {categories.map((category) => (
          <Button key={category._id} variant={cuisine === category.name ? 'default' : 'outline'} size="sm" onClick={() => setCuisine(category.name)}>
            {category.name}
          </Button>
        ))}
      </div>

      {featured.length ? (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Recommended today</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.slice(0, 3).map((restaurant) => (
              <Link key={restaurant._id} to={`/restaurants/${restaurant.slug}`} className="group relative min-h-56 overflow-hidden rounded-md text-orange-50">
                <img src={restaurant.coverUrl} alt={restaurant.name} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xl font-semibold">{restaurant.name}</p>
                  <p className="mt-1 text-sm text-orange-50/80">{restaurant.tags?.join(' · ')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80" />) : restaurants.map((restaurant) => (
          <Link key={restaurant._id} to={`/restaurants/${restaurant.slug}`}>
            <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <img src={restaurant.coverUrl} alt={restaurant.name} className="aspect-[16/9] w-full object-cover" loading="lazy" />
              <CardContent>
                <div className="flex items-start gap-3">
                  <img src={restaurant.logoUrl} alt="" className="h-14 w-14 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="truncate font-semibold">{restaurant.name}</h2>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      <Badge><Star className="h-3 w-3 fill-current" /> {restaurant.rating}</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <span><Clock className="mr-1 inline h-3 w-3" />{restaurant.deliveryTime}</span>
                      <span><Truck className="mr-1 inline h-3 w-3" />{formatCurrency(restaurant.deliveryFee)}</span>
                      <span>{restaurant.distanceKm} km</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
