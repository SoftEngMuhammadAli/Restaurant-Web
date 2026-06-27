import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    ctaLabel: { type: String, default: 'Order now' },
    ctaUrl: { type: String, default: '/restaurants' },
    placement: { type: String, enum: ['HERO', 'HOME_BANNER', 'RESTAURANT_CARD'], default: 'HOME_BANNER', index: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

promotionSchema.index({ placement: 1, sortOrder: 1 });

export const Promotion = mongoose.model('Promotion', promotionSchema);
