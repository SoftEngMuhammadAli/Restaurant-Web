import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const couponSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true },
    value: { type: Number, required: true, min: 0 },
    startsAt: Date,
    expiresAt: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

couponSchema.index({ restaurant: 1, code: 1 }, { unique: true });
couponSchema.plugin(softDeletePlugin);

export const Coupon = mongoose.model('Coupon', couponSchema);
