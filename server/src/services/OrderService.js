import { restaurantConfig } from '../config/index.js';
import { ORDER_STATUS, ORDER_TYPES, ROLES } from '../constants/enums.js';
import { MenuItem } from '../models/MenuItem.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Restaurant } from '../models/Restaurant.js';
import { ApiError } from '../utils/ApiError.js';
import { emitToStaff, emitToUser } from '../sockets/index.js';

const makeOrderNumber = () => `FD-${Date.now().toString().slice(-8)}`;

class OrderService {
  async list(user, query = {}) {
    const filter = { deletedAt: null };
    if (user.role === ROLES.CUSTOMER) filter.customer = user.id;
    if (query.status) filter.status = query.status;
    if (query.restaurant) filter.restaurant = query.restaurant;

    return Order.find(filter).populate('customer table restaurant').sort('-createdAt').limit(Number(query.limit || 50));
  }

  async get(user, id) {
    const filter = { _id: id, deletedAt: null };
    if (user.role === ROLES.CUSTOMER) filter.customer = user.id;
    const order = await Order.findOne(filter).populate('customer table restaurant');
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
  }

  async create(user, payload) {
    if (!Object.values(ORDER_TYPES).includes(payload.type)) {
      throw new ApiError(422, 'Invalid order type');
    }

    const restaurant = await Restaurant.findOne({
      _id: payload.restaurant,
      deletedAt: null,
      isOpen: true,
    });
    if (!restaurant) throw new ApiError(404, 'Restaurant not found or closed');

    const items = await Promise.all(
      payload.items.map(async (row) => {
        const menuItem = await MenuItem.findOne({
          _id: row.menuItem,
          restaurant: restaurant._id,
          deletedAt: null,
          isAvailable: true,
        });
        if (!menuItem) throw new ApiError(404, 'Menu item not found for this restaurant');

        const variantPrice = Number(row.variant?.price || 0);
        const addons = row.addons || [];
        const addonsTotal = addons.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
        const unitPrice = Number(menuItem.price) + variantPrice + addonsTotal;

        return {
          menuItem: menuItem._id,
          name: menuItem.name,
          quantity: row.quantity,
          unitPrice,
          variant: row.variant,
          addons,
          notes: row.notes,
        };
      }),
    );

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const tax = Number(((subtotal * restaurantConfig.taxRate) / 100).toFixed(2));
    const serviceCharge = payload.type === ORDER_TYPES.DINE_IN
      ? Number(((subtotal * restaurantConfig.serviceChargeRate) / 100).toFixed(2))
      : 0;
    const deliveryFee = payload.type === ORDER_TYPES.DELIVERY ? restaurant.deliveryFee : 0;
    const discount = Number(payload.discount || 0);
    const total = Number((subtotal + tax + serviceCharge + deliveryFee - discount).toFixed(2));

    const order = await Order.create({
      orderNumber: makeOrderNumber(),
      restaurant: restaurant._id,
      customer: user?.role === ROLES.CUSTOMER ? user.id : payload.customer,
      customerInfo: payload.customerInfo,
      table: payload.table,
      type: payload.type,
      items,
      subtotal,
      tax,
      serviceCharge,
      deliveryFee,
      discount,
      total,
      paymentMethod: payload.paymentMethod || 'CASH',
      notes: payload.notes,
    });

    emitToStaff('orders:new', order);
    if (order.customer) emitToUser(order.customer.toString(), 'orders:update', order);
    return order;
  }

  async updateStatus(id, status) {
    if (!Object.values(ORDER_STATUS).includes(status)) throw new ApiError(422, 'Invalid order status');

    const order = await Order.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { status },
      { new: true, runValidators: true },
    );
    if (!order) throw new ApiError(404, 'Order not found');

    emitToStaff('orders:update', order);
    if (order.customer) emitToUser(order.customer.toString(), 'orders:update', order);
    return order;
  }

  async pay(id, payload) {
    const order = await Order.findOne({ _id: id, deletedAt: null });
    if (!order) throw new ApiError(404, 'Order not found');

    const payment = await Payment.create({
      order: order._id,
      restaurant: order.restaurant,
      method: payload.method || order.paymentMethod,
      amount: order.total,
      status: 'PAID',
      reference: payload.reference || `PAY-${Date.now()}`,
    });

    order.paymentStatus = 'PAID';
    await order.save();

    return { order, payment };
  }
}

export const orderService = new OrderService();
