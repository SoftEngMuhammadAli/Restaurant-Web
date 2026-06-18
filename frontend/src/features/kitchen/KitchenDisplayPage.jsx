import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { orders } from '../../app/demoData.js';
import { getSocket } from '../../services/socket.js';

const statusColor = { PENDING: 'blue', PREPARING: 'amber', READY: 'green' };

export const KitchenDisplayPage = () => {
  const [tickets, setTickets] = useState(orders);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;
    socket.on('kitchen:new', (order) => {
      setTickets((current) => [order, ...current]);
      toast.success('Kitchen ticket added');
    });
    socket.on('kitchen:update', (order) => setTickets((current) => current.map((item) => (item._id === order._id ? order : item))));
    return () => {
      socket.off('kitchen:new');
      socket.off('kitchen:update');
    };
  }, []);

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Kitchen display</h1>
        <p className="text-sm text-muted-foreground">Large live tickets grouped by status for the line.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {tickets.map((order) => (
          <article key={order._id || order.id} className="rounded-lg border bg-card p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div><p className="text-xl font-semibold">{order.orderNumber || order.id}</p><p className="text-sm text-muted-foreground">{order.table?.number || order.table} · {order.age || 'Live'}</p></div>
              <Badge color={statusColor[order.status]}>{order.status}</Badge>
            </div>
            <div className="grid gap-2 text-lg">
              {(order.items?.length ? order.items : [{ name: 'Smash Burger', quantity: 2 }, { name: 'Cold Brew', quantity: 1 }]).map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex justify-between rounded-md bg-muted p-3"><span>{item.name}</span><strong>x{item.quantity}</strong></div>
              ))}
            </div>
            <Button className="mt-4 w-full"><CheckCircle2 className="h-4 w-4" /> Ready</Button>
          </article>
        ))}
      </section>
    </div>
  );
};
