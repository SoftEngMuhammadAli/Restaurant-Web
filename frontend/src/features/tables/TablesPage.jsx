import { Badge } from '../../components/ui/Badge.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { tables } from '../../app/demoData.js';
import { useListQuery, useUpdateTableStatusMutation } from '../../api/apiSlice.js';

const color = { AVAILABLE: 'green', OCCUPIED: 'amber', RESERVED: 'blue', MAINTENANCE: 'red' };

export const TablesPage = () => {
  const { data } = useListQuery({ resource: 'tables', params: {} });
  const [updateStatus] = useUpdateTableStatusMutation();
  const rows = data?.data?.length ? data.data : tables;

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Tables</h1>
        <p className="text-sm text-muted-foreground">Floor status, capacity, QR handoff, and maintenance tracking.</p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((table) => (
          <Card key={table._id || table.id}>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">T{table.number}</h3>
                <Badge color={color[table.status]}>{table.status}</Badge>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{table.seats} seats</p>
              <Select
                value={table.status}
                onChange={(event) => table._id && updateStatus({ id: table._id, status: event.target.value })}
                options={['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'].map((value) => ({ value, label: value }))}
              />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};
