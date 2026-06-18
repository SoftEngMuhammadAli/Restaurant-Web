import mongoose from 'mongoose';
import { ROLES } from '../constants/enums.js';
import { softDeletePlugin } from './plugins/softDelete.js';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, enum: Object.values(ROLES), required: true, unique: true },
    permissions: [{ type: String, trim: true }],
    system: { type: Boolean, default: false },
  },
  { timestamps: true },
);

roleSchema.plugin(softDeletePlugin);

export const Role = mongoose.model('Role', roleSchema);
