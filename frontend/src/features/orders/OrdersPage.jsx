import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Table, Td, Th } from '../../components/ui/Table.jsx';
import { orders } from '../../app/demoData.js';
import { getSocket } from '../../services/socket.js';
import { useListQuery, useUpdateOrderStatusMutation } from '../../api/apiSlice.js';

const statusColor = { READY: 'green', PREPARING: 'amber', PENDING: 'blue', CANCELLED: 'red' };

export const OrdersPage = () => {
  const { data } = useListQuery({ resource: 'orders', params: {} });
  const [updateStatus] = useUpdateOrderStatusMutation();
  const rows = data?.data?.length ? data.data : orders;

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;
    socket.on('orders:new', () => toast.success('New order received'));
    socket.on('orders:update', () => toast('Order updated'));
    return () => {
      socket.off('orders:new');
      socket.off('orders:update');
    };
  }, []);

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">Realtime dine-in, takeaway, delivery, and online orders.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <thead><tr><Th>Order</Th><Th>Table</Th><Th>Customer</Th><Th>Status</Th><Th>Total</Th><Th /></tr></thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order._id || order.id}>
                  <Td className="font-medium">{order.orderNumber || order.id}</Td>
                  <Td>{order.table?.number || order.table}</Td>
                  <Td>{order.customer?.name || order.customer}</Td>
                  <Td><Badge color={statusColor[order.status] || 'gray'}>{order.status}</Badge></Td>
                  <Td>${order.grandTotal || order.total}</Td>
                  <Td className="text-right">
                    <Button size="sm" variant="outline" onClick={() => order._id && updateStatus({ id: order._id, status: 'READY' })}>
                      Mark ready
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
