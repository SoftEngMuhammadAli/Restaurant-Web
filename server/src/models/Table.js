import mongoose from 'mongoose';
import { TABLE_STATUS } from '../constants/enums.js';

const tableSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true },
    number: { type: String, required: true, unique: true, trim: true },
    section: { type: String, default: 'Main Dining' },
    seats: { type: Number, required: true, min: 1 },
    status: { type: String, enum: Object.values(TABLE_STATUS), default: TABLE_STATUS.AVAILABLE },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

tableSchema.index({ restaurant: 1, number: 1 });

export const Table = mongoose.model('Table', tableSchema);
