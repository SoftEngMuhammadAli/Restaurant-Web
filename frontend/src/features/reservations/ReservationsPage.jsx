import { CalendarPlus } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Table, Td, Th } from '../../components/ui/Table.jsx';

const reservations = [
  { name: 'Nora Patel', time: '7:00 PM', party: 4, table: 'T6', status: 'CONFIRMED' },
  { name: 'Omar Lewis', time: '7:30 PM', party: 2, table: 'T2', status: 'PENDING' },
  { name: 'Sofia Ray', time: '8:15 PM', party: 6, table: 'T10', status: 'CONFIRMED' },
];

export const ReservationsPage = () => (
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
          <tbody>{reservations.map((item) => <tr key={item.name}><Td>{item.name}</Td><Td>{item.time}</Td><Td>{item.party}</Td><Td>{item.table}</Td><Td>{item.status}</Td></tr>)}</tbody>
        </Table>
      </CardContent>
    </Card>
  </div>
);
