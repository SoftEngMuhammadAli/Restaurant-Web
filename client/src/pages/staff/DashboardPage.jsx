import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { useDashboardQuery } from '../../api/apiSlice.js';

export const DashboardPage = () => {
  const { data } = useDashboardQuery();
  const dashboard = data?.data;
  const stats = [
    ['Revenue', `$${(dashboard?.revenue || 0).toLocaleString()}`],
    ['Orders', dashboard?.orders || 0],
    ['Reservations', dashboard?.reservations || 0],
    ['Active tables', dashboard?.activeTables || 0],
  ];

  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">{stats.map(([label, value]) => <Card key={label}><CardContent><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>)}</div>
      <Card><CardHeader><CardTitle>Weekly rhythm</CardTitle></CardHeader><CardContent className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard?.chart || []}><XAxis dataKey="day" /><Tooltip /><Bar dataKey="revenue" fill="#c2410c" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
    </div>
  );
};
