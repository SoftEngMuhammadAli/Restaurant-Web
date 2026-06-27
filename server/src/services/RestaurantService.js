import { restaurantConfig } from '../config/index.js';
import { ORDER_STATUS, TABLE_STATUS } from '../constants/enums.js';
import { Address } from '../models/Address.js';
import { Notification } from '../models/Notification.js';
import { Order } from '../models/Order.js';
import { Reservation } from '../models/Reservation.js';
import { Restaurant } from '../models/Restaurant.js';
import { Review } from '../models/Review.js';
import { Table } from '../models/Table.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { emitToStaff } from '../sockets/index.js';

class RestaurantService {
  info() {
    return restaurantConfig;
  }

  reviews() {
    return Review.find({ deletedAt: null, isPublished: true }).populate('restaurant').sort('-createdAt').limit(12);
  }

  async dashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [orders, revenue, reservations, activeTables, customers, recentOrders] = await Promise.all([
      Order.countDocuments({ deletedAt: null, createdAt: { $gte: today } }),
      Order.aggregate([
        { $match: { deletedAt: null, createdAt: { $gte: today }, status: { $ne: ORDER_STATUS.CANCELLED } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Reservation.countDocuments({ deletedAt: null, date: { $gte: today } }),
      Table.countDocuments({ deletedAt: null, status: { $in: [TABLE_STATUS.OCCUPIED, TABLE_STATUS.RESERVED] } }),
      User.countDocuments({ deletedAt: null, role: 'CUSTOMER' }),
      Order.find({ deletedAt: null }).populate('restaurant').sort('-createdAt').limit(8),
    ]);

    return {
      revenue: revenue[0]?.total || 0,
      orders,
      reservations,
      activeTables,
      customers,
      recentOrders,
      chart: [
        { day: 'Mon', revenue: 4200, orders: 42 },
        { day: 'Tue', revenue: 5100, orders: 49 },
        { day: 'Wed', revenue: 4700, orders: 46 },
        { day: 'Thu', revenue: 6200, orders: 63 },
        { day: 'Fri', revenue: 8400, orders: 81 },
        { day: 'Sat', revenue: 9200, orders: 88 },
        { day: 'Sun', revenue: 7100, orders: 67 },
      ],
    };
  }

  tables() {
    return Table.find({ deletedAt: null }).sort('section number');
  }

  async updateTableStatus(id, status) {
    const table = await Table.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { status },
      { new: true, runValidators: true },
    );
    if (!table) throw new ApiError(404, 'Table not found');
    emitToStaff('tables:update', table);
    return table;
  }

  reservations() {
    return Reservation.find({ deletedAt: null }).populate('restaurant table customer').sort('-date').limit(100);
  }

  async createReservation(user, payload) {
    if (payload.restaurant) {
      const restaurant = await Restaurant.findOne({ _id: payload.restaurant, deletedAt: null });
      if (!restaurant) throw new ApiError(404, 'Restaurant not found');
    }
    const reservation = await Reservation.create({
      ...payload,
      customer: user?.id,
    });
    emitToStaff('reservations:new', reservation);
    return reservation;
  }

  customers() {
    return User.find({ deletedAt: null, role: 'CUSTOMER' }).sort('-createdAt').limit(100);
  }

  async profile(userId) {
    const [user, addresses, orders, notifications] = await Promise.all([
      User.findById(userId),
      Address.find({ user: userId, deletedAt: null }).sort('-isDefault createdAt'),
      Order.find({ customer: userId, deletedAt: null }).populate('restaurant').sort('-createdAt').limit(10),
      Notification.find({ user: userId, deletedAt: null }).sort('-createdAt').limit(20),
    ]);
    if (!user) throw new ApiError(404, 'User not found');
    return { user, addresses, orders, notifications };
  }

  async addAddress(userId, payload) {
    if (payload.isDefault) await Address.updateMany({ user: userId }, { isDefault: false });
    return Address.create({ ...payload, user: userId });
  }
}

export const restaurantService = new RestaurantService();
