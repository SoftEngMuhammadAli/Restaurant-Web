import mongoose from 'mongoose';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

export const connectDatabase = async (uri = config.mongoUri) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info(`MongoDB connected: ${mongoose.connection.name}`);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
