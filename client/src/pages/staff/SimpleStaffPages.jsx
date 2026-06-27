import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { useCustomersQuery, useReservationsQuery, useTablesQuery, useUpdateTableStatusMutation } from '../../api/apiSlice.js';

export const TablesPage = () => {
  const { data } = useTablesQuery();
  const [update] = useUpdateTableStatusMutation();
  return <div className="grid gap-4"><h1 className="text-3xl font-semibold">Tables</h1><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(data?.data || []).map((table) => <Card key={table._id}><CardContent><p className="text-xl font-semibold">Table {table.number}</p><p className="mb-3 text-sm text-muted-foreground">{table.section} · {table.seats} seats</p><Select value={table.status} onChange={(e) => update({ id: table._id, status: e.target.value })} options={['AVAILABLE','OCCUPIED','RESERVED','MAINTENANCE'].map((status) => ({ value: status, label: status }))} /></CardContent></Card>)}</div></div>;
};

export const CustomersPage = () => {
  const { data } = useCustomersQuery();
  return <div className="grid gap-4"><h1 className="text-3xl font-semibold">Customers</h1>{(data?.data || []).map((customer) => <Card key={customer._id}><CardContent><p className="font-semibold">{customer.name}</p><p className="text-sm text-muted-foreground">{customer.email} · {customer.phone}</p></CardContent></Card>)}</div>;
};

export const AnalyticsPage = () => <div className="grid gap-4"><h1 className="text-3xl font-semibold">Analytics</h1><Card><CardContent>Analytics are shown on the dashboard. Add deeper reports as your restaurant needs them.</CardContent></Card></div>;

export const POSPage = () => <div className="grid gap-4"><h1 className="text-3xl font-semibold">POS</h1><Card><CardContent><p className="mb-3 text-muted-foreground">Use Orders for live tickets. POS payment workflow can build on the same order API.</p><Button>Start order</Button></CardContent></Card></div>;

export const ReservationsPage = () => {
  const { data } = useReservationsQuery();
  return <div className="grid gap-4"><h1 className="text-3xl font-semibold">Reservations</h1>{(data?.data || []).map((reservation) => <Card key={reservation._id}><CardContent><p className="font-semibold">{reservation.name}</p><p className="text-sm text-muted-foreground">{new Date(reservation.date).toLocaleString()} · party of {reservation.partySize}</p></CardContent></Card>)}</div>;
};
