import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Table, Td, Th } from '../../components/ui/Table.jsx';

const customers = [
  { name: 'Ariana Chen', email: 'ariana@example.com', visits: 18, spend: '$1,280' },
  { name: 'Miles Khan', email: 'miles@example.com', visits: 9, spend: '$640' },
  { name: 'Nora Patel', email: 'nora@example.com', visits: 24, spend: '$2,180' },
];

export const CustomersPage = () => (
  <div className="grid gap-5">
    <div>
      <h1 className="text-2xl font-semibold">Customers</h1>
      <p className="text-sm text-muted-foreground">Profiles, loyalty, preferences, addresses, and order history.</p>
    </div>
    <Card><CardContent className="p-0"><Table><thead><tr><Th>Name</Th><Th>Email</Th><Th>Visits</Th><Th>Spend</Th></tr></thead><tbody>{customers.map((item) => <tr key={item.email}><Td>{item.name}</Td><Td>{item.email}</Td><Td>{item.visits}</Td><Td>{item.spend}</Td></tr>)}</tbody></Table></CardContent></Card>
  </div>
);
