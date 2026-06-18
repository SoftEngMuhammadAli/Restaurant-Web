import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label: { type: String, default: 'Home' },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: String,
    country: { type: String, required: true },
    postalCode: String,
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

addressSchema.plugin(softDeletePlugin);

export const Address = mongoose.model('Address', addressSchema);
