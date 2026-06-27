import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    audience: { type: String, enum: ['STAFF', 'CUSTOMER'], default: 'STAFF' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: String,
    readAt: Date,
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

export const Notification = mongoose.model('Notification', notificationSchema);
