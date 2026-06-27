import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    partySize: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'PENDING',
    },
    notes: String,
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

export const Reservation = mongoose.model('Reservation', reservationSchema);
