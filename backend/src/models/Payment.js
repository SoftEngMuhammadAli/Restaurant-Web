import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../constants/enums.js';
import { softDeletePlugin } from './plugins/softDelete.js';

const paymentSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    provider: { type: String, enum: ['STRIPE', 'PAYPAL', 'JAZZCASH', 'EASYPAISA', 'CASH'], required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING, index: true },
    providerReference: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

paymentSchema.plugin(softDeletePlugin);

export const Payment = mongoose.model('Payment', paymentSchema);
