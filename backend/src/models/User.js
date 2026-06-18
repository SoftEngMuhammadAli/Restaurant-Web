import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { softDeletePlugin } from './plugins/softDelete.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', index: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: Date,
    refreshTokenHash: { type: String, select: false },
    lastLoginAt: Date,
    status: { type: String, enum: ['ACTIVE', 'INVITED', 'SUSPENDED'], default: 'ACTIVE' },
  },
  { timestamps: true },
);

userSchema.plugin(softDeletePlugin);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
