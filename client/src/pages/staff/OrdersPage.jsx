import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { useOrdersQuery, useUpdateOrderStatusMutation } from '../../api/apiSlice.js';

export const OrdersPage = () => {
  const { data } = useOrdersQuery({ limit: 100 });
  const [updateStatus] = useUpdateOrderStatusMutation();
  const orders = data?.data || [];
  return <div className="grid gap-4"><h1 className="text-3xl font-semibold">Orders</h1>{orders.map((order) => <Card key={order._id}><CardContent className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{order.orderNumber}</p><p className="text-sm text-muted-foreground">{order.type} · ${order.total.toFixed(2)}</p></div><Badge>{order.status}</Badge><div className="flex gap-2">{['CONFIRMED','PREPARING','READY','COMPLETED'].map((status) => <Button key={status} size="sm" variant="outline" onClick={() => updateStatus({ id: order._id, status })}>{status}</Button>)}</div></CardContent></Card>)}</div>;
};
