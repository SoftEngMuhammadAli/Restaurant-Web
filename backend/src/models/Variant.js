import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const variantSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    sku: String,
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

variantSchema.plugin(softDeletePlugin);

export const Variant = mongoose.model('Variant', variantSchema);
