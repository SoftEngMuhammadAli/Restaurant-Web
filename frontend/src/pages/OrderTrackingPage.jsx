import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { useGetMyOrdersQuery } from '../api/apiSlice.js';

const ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  READY: 'bg-cyan-100 text-cyan-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { data: ordersData, isLoading } = useGetMyOrdersQuery();
  const orders = ordersData?.data || [];

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-muted-foreground">Loading your orders...</p>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">No Orders Yet</h1>
          <p className="mt-2 text-muted-foreground">
            Start by browsing our menu and placing an order
          </p>
          <Button onClick={() => navigate('/store')} className="mt-6">
            Browse Menu
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/store')} className="rounded hover:bg-muted p-2">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Your Orders</h1>
          <p className="text-sm text-muted-foreground">Track your order status</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card
            key={order._id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/account/orders/${order._id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100'}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                  <p className="mt-1 text-sm">{order.items?.length || 0} items</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${(order.grandTotal || 0).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{order.type}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2 text-xs">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className="mt-1 text-center">Confirmed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${['PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className="mt-1 text-center">Preparing</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${['OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className="mt-1 text-center">Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${['DELIVERED', 'COMPLETED'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className="mt-1 text-center">Delivered</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
