import { useParams } from 'react-router-dom';
import { Clock, Store, Truck } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useOrderQuery, useOrdersQuery } from '../api/apiSlice.js';

const formatCurrency = (value = 0) => `Rs. ${Number(value).toLocaleString('en-PK')}`;

const steps = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'];

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const one = useOrderQuery(id, { skip: !id });
  const many = useOrdersQuery({}, { skip: Boolean(id) });
  const orders = id ? [one.data?.data].filter(Boolean) : many.data?.data || [];

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">{id ? 'Order tracking' : 'Your orders'}</h1>
        <p className="text-muted-foreground">Track restaurant, kitchen, delivery, and payment details.</p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const currentStep = Math.max(steps.indexOf(order.status), 0);
          return (
            <Card key={order._id}>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <Store className="mr-1 inline h-4 w-4" />{order.restaurant?.name || 'Restaurant'} - {order.type}
                    </p>
                  </div>
                  <Badge>{order.status}</Badge>
                </div>

                {id ? (
                  <div className="mt-6 grid gap-2 sm:grid-cols-4">
                    {steps.slice(0, 4).map((step, index) => (
                      <div key={step} className={`rounded-md border p-3 text-sm ${index <= currentStep ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                        <Clock className="mb-2 h-4 w-4" />
                        {step.replaceAll('_', ' ')}
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 space-y-2">
                  {order.items?.map((item) => (
                    <div key={item._id} className="flex justify-between rounded-md bg-muted p-3 text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-2 border-t pt-4 text-sm sm:grid-cols-3">
                  <div><span className="text-muted-foreground">Subtotal</span><p className="font-semibold">{formatCurrency(order.subtotal)}</p></div>
                  <div><span className="text-muted-foreground"><Truck className="mr-1 inline h-4 w-4" />Delivery</span><p className="font-semibold">{formatCurrency(order.deliveryFee)}</p></div>
                  <div><span className="text-muted-foreground">Total</span><p className="font-semibold">{formatCurrency(order.total)}</p></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
