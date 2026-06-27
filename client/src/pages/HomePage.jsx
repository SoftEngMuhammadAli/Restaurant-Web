import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Search, ShieldCheck, Star, Truck } from 'lucide-react';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useMarketplaceHomeQuery, useReviewsQuery } from '../api/apiSlice.js';

const formatCurrency = (value = 0) => `Rs. ${Number(value).toLocaleString('en-PK')}`;

export const HomePage = () => {
  const { data, isLoading } = useMarketplaceHomeQuery();
  const { data: reviewData } = useReviewsQuery();
  const home = data?.data;
  const hero = home?.promotions?.find((item) => item.placement === 'HERO') || home?.promotions?.[0];
  const banners = home?.promotions?.filter((item) => item.placement !== 'HERO') || [];
  const restaurants = home?.restaurants || [];
  const categories = home?.categories || [];
  const popularItems = home?.popularItems || [];
  const reviews = reviewData?.data || [];

  return (
    <div>
      <section className="relative overflow-hidden bg-[#200f0b] text-orange-50">
        <img
          src={hero?.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1800&q=85'}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#200f0b] via-[#200f0b]/78 to-[#200f0b]/20" />
        <div className="relative mx-auto grid min-h-[74vh] max-w-7xl content-center gap-8 px-4 py-16 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <Badge color="amber">Fast restaurant delivery</Badge>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
              Food from the best restaurants near you
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-orange-50/82">
              {hero?.subtitle || 'Browse trusted restaurants, discover deals, and track your order from kitchen to doorstep.'}
            </p>
            <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-md border border-orange-50/20 bg-orange-50 p-2 text-foreground shadow-2xl sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="border-0 pl-9 shadow-none" placeholder="Search biryani, burgers, pizza..." />
              </div>
              <Link to="/restaurants">
                <Button className="w-full sm:w-auto">Find food <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>

          <div className="hidden rounded-md border border-orange-50/20 bg-orange-50/10 p-4 backdrop-blur lg:block">
            <div className="grid gap-3">
              {restaurants.slice(0, 3).map((restaurant) => (
                <Link key={restaurant._id} to={`/restaurants/${restaurant.slug}`} className="flex items-center gap-3 rounded-md bg-orange-50 p-3 text-foreground shadow-lg transition hover:-translate-y-0.5">
                  <img src={restaurant.logoUrl} alt={restaurant.name} className="h-16 w-16 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{restaurant.name}</p>
                    <p className="text-sm text-muted-foreground">{restaurant.cuisine} - {restaurant.deliveryTime}</p>
                    <p className="mt-1 text-sm font-medium"><Star className="mr-1 inline h-4 w-4 fill-amber-400 text-amber-400" />{restaurant.rating}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-md border bg-card p-4">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><Truck className="h-5 w-5" /></span>
          <div><p className="font-semibold">Quick delivery</p><p className="text-sm text-muted-foreground">Live order flow from restaurant to customer</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-md border bg-card p-4">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></span>
          <div><p className="font-semibold">Trusted kitchens</p><p className="text-sm text-muted-foreground">Seeded restaurants with ratings and reviews</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-md border bg-card p-4">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></span>
          <div><p className="font-semibold">City coverage</p><p className="text-sm text-muted-foreground">Browse restaurants by cuisine and location</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Explore cuisines</h2>
            <p className="text-muted-foreground">Jump into the kind of food you are craving.</p>
          </div>
          <Link to="/restaurants" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {isLoading ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-32" />) : categories.slice(0, 6).map((category) => (
            <Link key={category._id} to={`/restaurants?cuisine=${category.name}`} className="group overflow-hidden rounded-md border bg-card">
              <img src={category.imageUrl} alt={category.name} className="aspect-square w-full object-cover transition group-hover:scale-105" />
              <div className="p-3 text-center font-semibold">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-3">
        {banners.slice(0, 3).map((banner) => (
          <Link key={banner._id} to={banner.ctaUrl} className="group relative min-h-52 overflow-hidden rounded-md bg-card text-orange-50 shadow-sm">
            <img src={banner.imageUrl} alt={banner.title} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-xl font-semibold">{banner.title}</p>
              <p className="mt-1 text-sm text-orange-50/82">{banner.subtitle}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Featured restaurants</h2>
            <p className="text-muted-foreground">Popular kitchens with strong ratings and fast delivery.</p>
          </div>
          <Link to="/restaurants" className="text-sm font-semibold text-primary">All restaurants</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {restaurants.map((restaurant) => (
            <Link key={restaurant._id} to={`/restaurants/${restaurant.slug}`}>
              <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
                <img src={restaurant.coverUrl} alt={restaurant.name} className="aspect-[16/10] w-full object-cover" loading="lazy" />
                <CardContent>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                    <Badge>{restaurant.rating}</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span><Clock className="mr-1 inline h-4 w-4" />{restaurant.deliveryTime}</span>
                    <span>{formatCurrency(restaurant.deliveryFee)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/55">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-5">
            <h2 className="text-3xl font-semibold">Popular right now</h2>
            <p className="text-muted-foreground">Top dishes across restaurants.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {popularItems.slice(0, 4).map((item) => (
              <Link key={item._id} to={`/restaurants/${item.restaurant?.slug}`}>
                <Card className="h-full overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <CardContent>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.restaurant?.name}</p>
                    <p className="mt-3 font-semibold">{formatCurrency(item.price)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 md:grid-cols-3">
        {reviews.slice(0, 3).map((review) => (
          <Card key={review._id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{review.name}</p>
                <Badge><Star className="h-3 w-3 fill-current" /> {review.rating}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">"{review.comment}"</p>
              {review.restaurant ? <p className="mt-3 text-xs font-medium text-primary">{review.restaurant.name}</p> : null}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};
