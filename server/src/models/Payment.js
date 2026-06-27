import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true },
    method: { type: String, enum: ['CASH', 'CARD', 'JAZZCASH', 'EASYPAISA'], required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    reference: String,
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

export const Payment = mongoose.model('Payment', paymentSchema);
