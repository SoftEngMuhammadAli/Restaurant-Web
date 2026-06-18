import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const customerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true },
    loyaltyPoints: { type: Number, default: 0, min: 0 },
    preferences: [String],
    notes: String,
  },
  { timestamps: true },
);

customerProfileSchema.plugin(softDeletePlugin);

export const CustomerProfile = mongoose.model('CustomerProfile', customerProfileSchema);
