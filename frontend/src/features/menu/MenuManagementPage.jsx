import { Search, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { menuItems } from '../../app/demoData.js';
import { useListQuery } from '../../api/apiSlice.js';

export const MenuManagementPage = () => {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);
  const { data } = useListQuery({ resource: 'menu-items', params: { search: debounced } });
  const items = data?.data?.length ? data.data : menuItems;
  const filtered = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Menu management</h1>
          <p className="text-sm text-muted-foreground">Categories, items, variants, addons, availability, and pricing.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Add item</Button>
      </div>
      <div className="relative max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search menu..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((item) => (
          <Card key={item._id || item.id} className="overflow-hidden">
            <img src={item.imageUrl || item.image} alt={item.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category?.name || item.category}</p>
                </div>
                <Badge color="green">${item.basePrice || item.price}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
};
