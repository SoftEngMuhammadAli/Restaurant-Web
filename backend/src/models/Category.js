import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const categorySchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: String,
    imageUrl: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

categorySchema.index({ restaurant: 1, slug: 1 }, { unique: true });
categorySchema.plugin(softDeletePlugin);

export const Category = mongoose.model('Category', categorySchema);
