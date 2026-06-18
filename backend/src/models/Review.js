import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const reviewSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5, index: true },
    comment: String,
    response: String,
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

reviewSchema.plugin(softDeletePlugin);

export const Review = mongoose.model('Review', reviewSchema);
