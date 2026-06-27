import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    cuisine: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    logoUrl: { type: String, required: true },
    coverUrl: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    reviewCount: { type: Number, min: 0, default: 0 },
    deliveryTime: { type: String, default: '25-35 min' },
    deliveryFee: { type: Number, min: 0, default: 0 },
    minimumOrder: { type: Number, min: 0, default: 0 },
    distanceKm: { type: Number, min: 0, default: 1 },
    isOpen: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    tags: [{ type: String, trim: true }],
    address: {
      line1: String,
      area: String,
      city: String,
      country: String,
    },
    phone: String,
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

restaurantSchema.index({ name: 'text', cuisine: 'text', description: 'text', tags: 'text' });
restaurantSchema.index({ isFeatured: -1, rating: -1 });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
