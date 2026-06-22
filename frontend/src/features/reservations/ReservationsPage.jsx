import { CalendarPlus } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Table, Td, Th } from '../../components/ui/Table.jsx';
import { useListQuery } from '../../api/apiSlice.js';

const reservations = [
  { name: 'Nora Patel', time: '7:00 PM', party: 4, table: 'T6', status: 'CONFIRMED' },
  { name: 'Omar Lewis', time: '7:30 PM', party: 2, table: 'T2', status: 'PENDING' },
  { name: 'Sofia Ray', time: '8:15 PM', party: 6, table: 'T10', status: 'CONFIRMED' },
];

export const ReservationsPage = () => {
  const { data } = useListQuery({ resource: 'reservations', params: { limit: 50 } });
  const rows = data?.data?.length ? data.data : reservations;

  return (
  <div className="grid gap-5">
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Reservations</h1>
        <p className="text-sm text-muted-foreground">Booking, table assignment, guest notes, and arrival flow.</p>
      </div>
      <Button><CalendarPlus className="h-4 w-4" /> New</Button>
    </div>
    <Card>
      <CardContent className="p-0">
        <Table>
          <thead><tr><Th>Guest</Th><Th>Time</Th><Th>Party</Th><Th>Table</Th><Th>Status</Th></tr></thead>
          <tbody>{rows.map((item) => <tr key={item._id || item.name}><Td>{item.guestName || item.name}</Td><Td>{item.startsAt ? new Date(item.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : item.time}</Td><Td>{item.partySize || item.party}</Td><Td>{item.table?.number || item.table}</Td><Td>{item.status}</Td></tr>)}</tbody>
        </Table>
      </CardContent>
    </Card>
  </div>
  );
};
