import { ORDER_STATUS } from '../constants/enums.js';
import { ApiError } from '../utils/ApiError.js';
import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { emitRestaurantEvent } from '../sockets/index.js';

class OrderService {
  async list({ user, query }) {
    const filter = { restaurant: user.restaurant, deletedAt: null };
    if (query.status) filter.status = query.status;
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const [items, total] = await Promise.all([
      Order.find(filter)
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('table customer'),
      Order.countDocuments(filter),
    ]);
    return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 } };
  }

  async create({ user, payload }) {
    const items = await Promise.all(
      payload.items.map(async (item) => {
        const menuItem = await MenuItem.findOne({ _id: item.menuItem, restaurant: user.restaurant, deletedAt: null });
        if (!menuItem) throw new ApiError(404, 'Menu item not found');
        return {
          menuItem: menuItem._id,
          name: menuItem.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice ?? menuItem.basePrice,
          addons: item.addons || [],
          variant: item.variant,
          notes: item.notes,
        };
      }),
    );

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxTotal = Number(payload.taxTotal || 0);
    const discountTotal = Number(payload.discountTotal || 0);
    const serviceCharge = Number(payload.serviceCharge || 0);
    const order = await Order.create({
      restaurant: user.restaurant,
      orderNumber: `ORD-${Date.now()}`,
      type: payload.type,
      table: payload.table,
      customer: payload.customer,
      items,
      subtotal,
      taxTotal,
      discountTotal,
      serviceCharge,
      grandTotal: Math.max(subtotal + taxTotal + serviceCharge - discountTotal, 0),
      notes: payload.notes,
    });

    emitRestaurantEvent(user.restaurant, 'orders:new', order);
    emitRestaurantEvent(user.restaurant, 'kitchen:new', order);
    return order;
  }

  async updateStatus({ user, id, status }) {
    if (!Object.values(ORDER_STATUS).includes(status)) throw new ApiError(422, 'Invalid order status');
    const order = await Order.findOneAndUpdate(
      { _id: id, restaurant: user.restaurant, deletedAt: null },
      { status },
      { new: true, runValidators: true },
    );
    if (!order) throw new ApiError(404, 'Order not found');
    emitRestaurantEvent(user.restaurant, 'orders:update', order);
    emitRestaurantEvent(user.restaurant, 'kitchen:update', order);
    return order;
  }
}

export const orderService = new OrderService();
