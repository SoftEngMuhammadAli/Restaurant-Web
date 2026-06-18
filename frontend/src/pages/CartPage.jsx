import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { menuItems } from '../app/demoData.js';

export const CartPage = () => {
  const cart = menuItems.slice(0, 2).map((item) => ({ ...item, qty: 1 }));
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <section className="mx-auto grid max-w-3xl gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">Cart</h1>
      <Card><CardContent className="grid gap-3">{cart.map((item) => <div key={item.id} className="flex justify-between rounded-md bg-muted p-3"><span>{item.name} x{item.qty}</span><strong>${item.price}</strong></div>)}<div className="flex justify-between border-t pt-4 text-lg font-semibold"><span>Total</span><span>${total}</span></div><Link to="/checkout" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Checkout</Link></CardContent></Card>
    </section>
  );
};
