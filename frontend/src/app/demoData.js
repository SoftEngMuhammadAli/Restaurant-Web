export const stats = [
  { label: 'Revenue', value: '$18.4k', delta: '+12.8%' },
  { label: 'Orders', value: '328', delta: '+8.2%' },
  { label: 'Reservations', value: '46', delta: '+5.1%' },
  { label: 'Active Tables', value: '17', delta: 'Live' },
];

export const chartData = [
  { name: 'Mon', revenue: 4200, orders: 44 },
  { name: 'Tue', revenue: 5100, orders: 52 },
  { name: 'Wed', revenue: 3900, orders: 38 },
  { name: 'Thu', revenue: 6200, orders: 66 },
  { name: 'Fri', revenue: 8200, orders: 84 },
  { name: 'Sat', revenue: 9400, orders: 97 },
  { name: 'Sun', revenue: 7100, orders: 72 },
];

export const menuItems = [
  { id: 1, name: 'Shakshuka Toast', category: 'Breakfast', price: 12, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Smash Burger', category: 'Burgers', price: 15, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Salmon Bowl', category: 'Bowls', price: 18, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Cold Brew', category: 'Drinks', price: 5, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },
];

export const orders = [
  { id: 'ORD-1942', table: 'T4', customer: 'Ariana Chen', status: 'PREPARING', total: 64, items: 5, age: '08m' },
  { id: 'ORD-1943', table: 'T8', customer: 'Walk-in', status: 'READY', total: 42, items: 3, age: '12m' },
  { id: 'ORD-1944', table: 'Delivery', customer: 'Miles Khan', status: 'PENDING', total: 28, items: 2, age: '02m' },
];

export const tables = Array.from({ length: 16 }).map((_, index) => ({
  id: index + 1,
  number: index + 1,
  seats: index % 4 === 0 ? 6 : 4,
  status: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'][index % 4],
}));
