import { Search, SplitSquareHorizontal, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { menuItems, tables } from '../../app/demoData.js';

export const POSPage = () => {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const filtered = useMemo(() => menuItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const add = (item) => {
    setCart((current) => {
      const existing = current.find((row) => row.id === item.id);
      if (existing) return current.map((row) => (row.id === item.id ? { ...row, qty: row.qty + 1 } : row));
      return [...current, { ...item, qty: 1 }];
    });
  };

  return (
    <div className="grid min-h-[calc(100vh-7rem)] gap-4 xl:grid-cols-[1fr_420px]">
      <section className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">POS</h1>
            <p className="text-sm text-muted-foreground">Search, table selection, discounts, split bills, and payments.</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search items" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <button key={item.id} type="button" onClick={() => add(item)} className="overflow-hidden rounded-lg border bg-card text-left shadow-soft transition hover:-translate-y-0.5">
              <img src={item.image} alt={item.name} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <p className="font-semibold">{item.name}</p>
                <div className="mt-2 flex items-center justify-between"><span className="text-sm text-muted-foreground">{item.category}</span><Badge color="green">${item.price}</Badge></div>
              </div>
            </button>
          ))}
        </div>
      </section>
      <aside className="rounded-lg border bg-card p-4 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Table" options={tables.slice(0, 8).map((table) => ({ value: table.number, label: `Table ${table.number}` }))} />
          <Select label="Customer" options={[{ value: 'walkin', label: 'Walk-in' }, { value: 'ariana', label: 'Ariana Chen' }]} />
        </div>
        <div className="my-5 grid gap-3">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md bg-muted p-3">
              <div><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">Qty {item.qty}</p></div>
              <p className="font-semibold">${item.price * item.qty}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-2 border-t pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>$0.00</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${(subtotal * 0.085).toFixed(2)}</span></div>
          <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>${(subtotal * 1.085).toFixed(2)}</span></div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="outline"><SplitSquareHorizontal className="h-4 w-4" /> Split</Button>
          <Button variant="outline" onClick={() => setCart([])}><Trash2 className="h-4 w-4" /> Clear</Button>
          <Button>Pay</Button>
        </div>
      </aside>
    </div>
  );
};
