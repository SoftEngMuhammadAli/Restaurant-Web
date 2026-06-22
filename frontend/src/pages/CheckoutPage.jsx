import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';
import { useCreateOrderMutation } from '../api/apiSlice.js';
import { clearCart } from '../features/orders/cartSlice.js';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  paymentMethod: z.string().min(1, 'Payment method required'),
  fulfillmentType: z.string().min(1, 'Fulfillment type required'),
  notes: z.string().optional(),
});

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      paymentMethod: 'CASH',
      fulfillmentType: 'DELIVERY',
    },
  });

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Your cart is empty</p>
          <Button onClick={() => navigate('/store')}>Continue Shopping</Button>
        </div>
      </section>
    );
  }

  const onSubmit = async (data) => {
    try {
      const orderData = {
        type: data.fulfillmentType,
        items: items.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        taxTotal: Number((total * 0.085).toFixed(2)),
        serviceCharge: data.fulfillmentType === 'DELIVERY' ? deliveryFee : 0,
        notes: data.notes,
      };

      const response = await createOrder(orderData).unwrap();

      dispatch(clearCart());
      toast.success('Order placed successfully!');

      // Navigate to order tracking
      navigate(`/account/orders/${response.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to place order');
    }
  };

  const deliveryFee = 5;
  const grandTotal = total + deliveryFee;

  return (
    <section className="mx-auto grid max-w-3xl gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-muted-foreground">Complete your order</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <h3 className="font-semibold">Delivery Details</h3>
                  <Input label="Full Name" error={errors.name?.message} {...register('name')} />
                  <Input
                    label="Email"
                    type="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Input label="Address" error={errors.address?.message} {...register('address')} />
                  <Input label="City" error={errors.city?.message} {...register('city')} />
                </div>

                <div className="border-t pt-4 space-y-2">
                  <h3 className="font-semibold">Order Preferences</h3>
                  <Select
                    label="Fulfillment Type"
                    error={errors.fulfillmentType?.message}
                    options={[
                      { value: 'DELIVERY', label: 'Delivery' },
                      { value: 'TAKEAWAY', label: 'Pickup' },
                      { value: 'DINE_IN', label: 'Dine In' },
                    ]}
                    {...register('fulfillmentType')}
                  />
                  <Select
                    label="Payment Method"
                    error={errors.paymentMethod?.message}
                    options={[
                      { value: 'CASH', label: 'Cash on Delivery' },
                      { value: 'STRIPE', label: 'Card Payment' },
                      { value: 'EASYPAISA', label: 'EasyPaisa' },
                    ]}
                    {...register('paymentMethod')}
                  />
                  <Input
                    label="Special Instructions (Optional)"
                    error={errors.notes?.message}
                    {...register('notes')}
                    placeholder="Any special requests?"
                  />
                </div>

                <Button type="submit" className="w-full" loading={isLoading} disabled={isLoading}>
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="h-fit">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Order Summary</h3>
              <div className="space-y-3 border-b pb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 text-base font-bold">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
