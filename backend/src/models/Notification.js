import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const notificationSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: String,
    data: mongoose.Schema.Types.Mixed,
    readAt: Date,
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, readAt: 1, createdAt: -1 });
notificationSchema.plugin(softDeletePlugin);

export const Notification = mongoose.model('Notification', notificationSchema);
