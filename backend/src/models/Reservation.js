import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const reservationSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    guestName: { type: String, required: true },
    guestPhone: { type: String, required: true },
    guestEmail: String,
    partySize: { type: Number, required: true, min: 1 },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'PENDING',
      index: true,
    },
    notes: String,
  },
  { timestamps: true },
);

reservationSchema.index({ restaurant: 1, startsAt: 1, status: 1 });
reservationSchema.plugin(softDeletePlugin);

export const Reservation = mongoose.model('Reservation', reservationSchema);
