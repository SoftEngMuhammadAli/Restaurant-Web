import { motion } from 'framer-motion';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useDashboardQuery } from '../../api/apiSlice.js';
import { chartData, stats } from '../../app/demoData.js';

export const DashboardPage = () => {
  const { data } = useDashboardQuery();
  const dashboard = data?.data;
  const liveStats = dashboard
    ? [
        { label: 'Revenue', value: `$${dashboard.revenue.toLocaleString()}`, delta: 'Today' },
        { label: 'Orders', value: dashboard.orders, delta: 'Today' },
        { label: 'Reservations', value: dashboard.reservations, delta: 'Upcoming' },
        { label: 'Active Tables', value: dashboard.activeTables, delta: 'Live' },
      ]
    : stats;
  const graph = dashboard?.chart || chartData;

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Revenue, service velocity, table pressure, and demand signals.</p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {liveStats.map((item, index) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <Badge color={item.delta === 'Live' ? 'blue' : 'green'}>{item.delta}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graph}>
                <defs>
                  <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" fill="url(#revenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top selling items</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard?.topItems?.length ? dashboard.topItems.map((item) => ({ name: item._id, quantity: item.quantity })) : graph}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
