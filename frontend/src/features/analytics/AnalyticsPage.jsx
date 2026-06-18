import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { chartData } from '../../app/demoData.js';

export const AnalyticsPage = () => (
  <div className="grid gap-5">
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="text-sm text-muted-foreground">Sales mix, top items, table turns, order channels, and guest demand.</p>
    </div>
    <Card>
      <CardHeader><CardTitle>Orders by day</CardTitle></CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="orders" fill="#0ea5e9" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);
