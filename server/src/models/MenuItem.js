import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    labels: [{ type: String }],
    spiceLevel: { type: Number, min: 0, max: 3, default: 0 },
    prepTimeMinutes: { type: Number, default: 15, min: 0 },
    variants: [optionSchema],
    addons: [optionSchema],
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

menuItemSchema.index({ name: 'text', description: 'text', labels: 'text' });
menuItemSchema.index({ restaurant: 1, slug: 1 }, { unique: true });
menuItemSchema.index({ restaurant: 1, category: 1, isAvailable: 1 });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
