import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const transactionSchema = new mongoose.Schema(
  {
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
    type: { type: String, enum: ['AUTHORIZATION', 'CAPTURE', 'REFUND', 'VOID'], required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    reference: String,
    raw: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

transactionSchema.plugin(softDeletePlugin);

export const Transaction = mongoose.model('Transaction', transactionSchema);
