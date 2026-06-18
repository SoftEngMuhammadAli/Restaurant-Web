import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: String,
    basePrice: { type: Number, required: true, min: 0 },
    imageUrl: String,
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }],
    addons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Addon' }],
    tags: [String],
    prepTimeMinutes: { type: Number, default: 15, min: 0 },
    isAvailable: { type: Boolean, default: true, index: true },
    nutrition: {
      calories: Number,
      allergens: [String],
    },
  },
  { timestamps: true },
);

menuItemSchema.index({ restaurant: 1, slug: 1 }, { unique: true });
menuItemSchema.plugin(softDeletePlugin);

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
