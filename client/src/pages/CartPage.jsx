import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { removeItem, selectCartRestaurant, selectCartTotal, updateQuantity } from '../features/cart/cartSlice.js';

const formatCurrency = (value = 0) => `Rs. ${Number(value).toLocaleString('en-PK')}`;

export const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const restaurant = useSelector(selectCartRestaurant);
  const subtotal = useSelector(selectCartTotal);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const total = subtotal + deliveryFee;
  const minimumOrder = restaurant?.minimumOrder || 0;
  const meetsMinimum = subtotal >= minimumOrder;

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-md bg-primary/10 text-primary">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Pick a restaurant, add food, and your order summary will appear here.</p>
        <Link to="/restaurants"><Button className="mt-5">Browse restaurants</Button></Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Cart</h1>
          <p className="text-muted-foreground">Ordering from {restaurant?.name || 'selected restaurant'}.</p>
        </div>

        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}><Minus className="h-4 w-4" /></Button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                <Button variant="ghost" size="icon" onClick={() => dispatch(removeItem(item.id))} aria-label={`Remove ${item.name}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardContent>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">Order summary</h2>
                <p className="text-sm text-muted-foreground">{restaurant?.name}</p>
              </div>
              <Badge color={meetsMinimum ? 'green' : 'amber'}>{meetsMinimum ? 'Ready' : 'Minimum'}</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span><Truck className="mr-1 inline h-4 w-4" />Delivery</span><span>{formatCurrency(deliveryFee)}</span></div>
              <div className="flex justify-between border-t pt-3 text-lg font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            {!meetsMinimum ? <p className="mt-4 rounded-md bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">Minimum order is {formatCurrency(minimumOrder)}.</p> : null}
            <div className="mt-5 grid gap-3">
              <Link to={restaurant?.slug ? `/restaurants/${restaurant.slug}` : '/restaurants'}><Button variant="outline" className="w-full">Add more items</Button></Link>
              <Link to="/checkout"><Button className="w-full" disabled={!meetsMinimum}>Checkout</Button></Link>
            </div>
          </CardContent>
        </Card>
      </aside>
    </section>
  );
};
