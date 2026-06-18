import mongoose from 'mongoose';
import { TABLE_STATUS } from '../constants/enums.js';
import { softDeletePlugin } from './plugins/softDelete.js';

const tableSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    number: { type: String, required: true, trim: true },
    section: { type: String, default: 'Main' },
    seats: { type: Number, required: true, min: 1 },
    status: { type: String, enum: Object.values(TABLE_STATUS), default: TABLE_STATUS.AVAILABLE, index: true },
    qrCodeUrl: String,
  },
  { timestamps: true },
);

tableSchema.index({ restaurant: 1, number: 1 }, { unique: true });
tableSchema.plugin(softDeletePlugin);

export const Table = mongoose.model('Table', tableSchema);
