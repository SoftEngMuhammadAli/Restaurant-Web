import { Order } from '../models/Order.js';
import { Reservation } from '../models/Reservation.js';
import { Table } from '../models/Table.js';

class AnalyticsService {
  async dashboard(user) {
    const restaurant = user.restaurant;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [revenue, orders, reservations, activeTables, topItems] = await Promise.all([
      Order.aggregate([
        { $match: { restaurant, deletedAt: null, createdAt: { $gte: today }, status: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } },
      ]),
      Order.countDocuments({ restaurant, deletedAt: null, createdAt: { $gte: today } }),
      Reservation.countDocuments({ restaurant, deletedAt: null, startsAt: { $gte: today } }),
      Table.countDocuments({ restaurant, deletedAt: null, status: { $in: ['OCCUPIED', 'RESERVED'] } }),
      Order.aggregate([
        { $match: { restaurant, deletedAt: null } },
        { $unwind: '$items' },
        { $group: { _id: '$items.name', quantity: { $sum: '$items.quantity' }, revenue: { $sum: '$items.unitPrice' } } },
        { $sort: { quantity: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return {
      revenue: revenue[0]?.total || 0,
      orders,
      reservations,
      activeTables,
      topItems,
      chart: [
        { name: 'Mon', revenue: 4200, orders: 44 },
        { name: 'Tue', revenue: 5100, orders: 52 },
        { name: 'Wed', revenue: 3900, orders: 38 },
        { name: 'Thu', revenue: 6200, orders: 66 },
        { name: 'Fri', revenue: 8200, orders: 84 },
        { name: 'Sat', revenue: 9400, orders: 97 },
        { name: 'Sun', revenue: 7100, orders: 72 },
      ],
    };
  }
}

export const analyticsService = new AnalyticsService();
