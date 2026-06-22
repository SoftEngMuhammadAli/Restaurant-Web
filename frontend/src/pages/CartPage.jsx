import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { removeFromCart, updateQuantity } from '../features/orders/cartSlice.js';

export const CartPage = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <section className="mx-auto grid max-w-3xl gap-4 px-4 py-12">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Start adding delicious items to your order.</p>
          <Link to="/store">
            <Button className="mt-6">Continue shopping</Button>
          </Link>
        </div>
      </section>
    );
  }

  const deliveryFee = 5;

  return (
    <section className="mx-auto grid max-w-4xl gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Your cart</h1>
        <p className="text-sm text-muted-foreground">Review your items before checkout.</p>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <CardContent className="flex gap-4 p-4">
              {item.image ? (
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
              ) : null}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                {item.description ? (
                  <p className="truncate text-sm text-muted-foreground">{item.description}</p>
                ) : null}
                <p className="mt-2 font-semibold">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                    className="grid h-8 w-8 place-items-center rounded-md border hover:bg-muted"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                    className="grid h-8 w-8 place-items-center rounded-md border hover:bg-muted"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-destructive hover:opacity-80"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="space-y-2 p-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Estimated delivery</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span>
            <span>${(total + deliveryFee).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/store">
          <Button variant="outline" className="w-full">Continue shopping</Button>
        </Link>
        <Link to="/checkout">
          <Button className="w-full">Proceed to checkout</Button>
        </Link>
      </div>
    </section>
  );
};
