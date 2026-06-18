import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const addonSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

addonSchema.index({ restaurant: 1, name: 1 });
addonSchema.plugin(softDeletePlugin);

export const Addon = mongoose.model('Addon', addonSchema);
