import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.js';

const permissionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

permissionSchema.plugin(softDeletePlugin);

export const Permission = mongoose.model('Permission', permissionSchema);
