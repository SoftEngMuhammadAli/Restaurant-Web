import { Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { useGetMenuItemsQuery, useGetCategoriesQuery } from '../api/apiSlice.js';
import { addToCart } from '../features/orders/cartSlice.js';

export const StorefrontPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: menuData, isLoading: menuLoading } = useGetMenuItemsQuery();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const cartItemsCount = useSelector((state) => state.cart.items.length);

  const menuItems = menuData?.data || [];
  const categories = categoriesData?.data || [];

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => String(item.category?._id || item.category) === selectedCategory)
    : menuItems;

  const handleAddToCart = (item) => {
    dispatch(addToCart({ product: item }));
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Restaurant Menu</h1>
            <p className="text-sm text-muted-foreground">Browse and order your favorite dishes</p>
          </div>
          <Button onClick={() => navigate('/cart')} variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartItemsCount}
              </span>
            )}
            Cart
          </Button>
        </div>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Items
              </Button>
              {categories.map((category) => (
                <Button
                  key={category._id}
                  variant={selectedCategory === category._id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category._id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {menuLoading || categoriesLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No items available</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {(item.imageUrl || item.image) && (
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.name}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                )}
                <CardContent className="p-4">
                  <h2 className="font-semibold line-clamp-1">{item.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  {item.category?.name && (
                    <p className="mt-2 text-xs text-muted-foreground">{item.category.name}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold">${(item.basePrice ?? item.price ?? 0).toFixed(2)}</span>
                    <Button size="sm" onClick={() => handleAddToCart(item)} className="gap-1">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
