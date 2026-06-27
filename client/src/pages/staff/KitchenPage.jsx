import { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useOrdersQuery, useUpdateOrderStatusMutation } from '../../api/apiSlice.js';
import { getSocket } from '../../services/socket.js';

export const KitchenPage = () => {
  const { data } = useOrdersQuery({ status: 'PREPARING' });
  const [tickets, setTickets] = useState([]);
  const [updateStatus] = useUpdateOrderStatusMutation();

  useEffect(() => { if (data?.data) setTickets(data.data); }, [data]);
  useEffect(() => {
    const socket = getSocket();
    socket.on('orders:new', (order) => setTickets((current) => [order, ...current]));
    socket.on('orders:update', (order) => setTickets((current) => current.map((row) => row._id === order._id ? order : row)));
    return () => { socket.off('orders:new'); socket.off('orders:update'); };
  }, []);

  return <div className="grid gap-4"><h1 className="text-3xl font-semibold">Kitchen display</h1><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tickets.map((order) => <article key={order._id} className="rounded-lg border bg-card p-5"><div className="mb-4 flex justify-between"><p className="text-xl font-semibold">{order.orderNumber}</p><Badge>{order.status}</Badge></div><div className="grid gap-2">{order.items.map((item) => <div key={item._id} className="flex justify-between rounded-md bg-muted p-3"><span>{item.name}</span><strong>x{item.quantity}</strong></div>)}</div><Button className="mt-4 w-full" onClick={() => updateStatus({ id: order._id, status: 'READY' })}>Mark ready</Button></article>)}</div></div>;
};
