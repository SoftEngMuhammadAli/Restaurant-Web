import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    variant: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
      name: String,
      price: Number,
    },
    addons: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Addon' },
        name: String,
        price: Number,
      },
    ],
    notes: String,
    status: { type: String, enum: ['QUEUED', 'FIRE', 'READY', 'SERVED'], default: 'QUEUED' },
  },
  { timestamps: true, _id: true },
);

export const OrderItemSchema = orderItemSchema;
