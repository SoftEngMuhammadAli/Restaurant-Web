import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_TYPES } from '../constants/enums.js';

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    variant: {
      name: String,
      price: Number,
    },
    addons: [
      {
        name: String,
        price: Number,
      },
    ],
    notes: String,
  },
  { _id: true },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerInfo: {
      name: String,
      phone: String,
      email: String,
      address: String,
    },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    type: { type: String, enum: Object.values(ORDER_TYPES), required: true },
    items: [orderItemSchema],
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    serviceCharge: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['CASH', 'CARD', 'JAZZCASH', 'EASYPAISA'], default: 'CASH' },
    paymentStatus: { type: String, enum: ['UNPAID', 'PAID', 'REFUNDED'], default: 'UNPAID' },
    notes: String,
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1, createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
