import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';
import { useCreateOrderMutation } from '../api/apiSlice.js';
import { clearCart, selectCartRestaurant, selectCartTotal } from '../features/cart/cartSlice.js';

const formatCurrency = (value = 0) => `Rs. ${Number(value).toLocaleString('en-PK')}`;

export const CheckoutPage = () => {
  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.cart.items);
  const restaurant = useSelector(selectCartRestaurant);
  const subtotal = useSelector(selectCartTotal);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    type: 'DELIVERY',
    paymentMethod: 'CASH',
  });
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deliveryFee = form.type === 'DELIVERY' ? restaurant?.deliveryFee || 0 : 0;
  const estimatedTotal = subtotal + deliveryFee;

  const submit = async (event) => {
    event.preventDefault();
    if (!restaurant?._id) {
      toast.error('Please select a restaurant first');
      navigate('/restaurants');
      return;
    }

    try {
      const response = await createOrder({
        restaurant: restaurant._id,
        type: form.type,
        customerInfo: { name: form.name, phone: form.phone, email: form.email, address: form.address },
        paymentMethod: form.paymentMethod,
        items: items.map((item) => ({ menuItem: item.id, quantity: item.quantity })),
      }).unwrap();
      dispatch(clearCart());
      toast.success('Order placed');
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Could not place order');
    }
  };

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">Nothing to checkout</h1>
        <Link to="/restaurants"><Button className="mt-5">Browse restaurants</Button></Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <Card>
        <CardContent>
          <div className="mb-6">
            <h1 className="text-3xl font-semibold">Checkout</h1>
            <p className="text-muted-foreground">Confirm delivery details for {restaurant?.name}.</p>
          </div>
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Delivery address" required={form.type === 'DELIVERY'} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Order type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={[{ value: 'DELIVERY', label: 'Delivery' }, { value: 'TAKEAWAY', label: 'Pickup' }, { value: 'DINE_IN', label: 'Dine in' }]} />
              <Select label="Payment" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} options={[{ value: 'CASH', label: 'Cash' }, { value: 'CARD', label: 'Card' }, { value: 'JAZZCASH', label: 'JazzCash' }, { value: 'EASYPAISA', label: 'EasyPaisa' }]} />
            </div>
            <Button disabled={isLoading || !items.length}>{isLoading ? 'Placing order...' : 'Place order'}</Button>
          </form>
        </CardContent>
      </Card>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></span>
              <div><h2 className="font-semibold">{restaurant?.name}</h2><p className="text-sm text-muted-foreground">Estimated {restaurant?.deliveryTime}</p></div>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(deliveryFee)}</span></div>
              <div className="flex justify-between text-lg font-semibold"><span>Estimated total</span><span>{formatCurrency(estimatedTotal)}</span></div>
            </div>
            <p className="mt-4 flex gap-2 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="mt-0.5 h-4 w-4" />
              Your order is validated against restaurant menu availability before it is accepted.
            </p>
          </CardContent>
        </Card>
      </aside>
    </section>
  );
};
