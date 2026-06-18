import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    logoUrl: String,
    coverUrl: String,
    phone: String,
    email: { type: String, lowercase: true, trim: true },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    settings: {
      taxRate: { type: Number, default: 0 },
      serviceChargeRate: { type: Number, default: 0 },
      acceptsOnlineOrders: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

restaurantSchema.plugin(softDeletePlugin);

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
