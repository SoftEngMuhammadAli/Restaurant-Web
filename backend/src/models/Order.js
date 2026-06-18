import mongoose from 'mongoose';
import { ORDER_STATUS } from '../constants/enums.js';
import { OrderItemSchema } from './OrderItem.js';
import { softDeletePlugin } from './plugins/softDelete.js';

const orderSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['DINE_IN', 'TAKEAWAY', 'DELIVERY', 'ONLINE'], default: 'DINE_IN' },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    items: [OrderItemSchema],
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING, index: true },
    subtotal: { type: Number, required: true, min: 0 },
    discountTotal: { type: Number, default: 0, min: 0 },
    taxTotal: { type: Number, default: 0, min: 0 },
    serviceCharge: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ['UNPAID', 'PARTIAL', 'PAID', 'REFUNDED'], default: 'UNPAID' },
    notes: String,
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

orderSchema.index({ restaurant: 1, status: 1, createdAt: -1 });
orderSchema.plugin(softDeletePlugin);

export const Order = mongoose.model('Order', orderSchema);
