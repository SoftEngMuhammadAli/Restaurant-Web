import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

export const cleanupExpiredPasswordTokens = async () => {
  const result = await User.updateMany(
    { passwordResetExpires: { $lt: new Date() } },
    { $unset: { passwordResetToken: '', passwordResetExpires: '' } },
  );
  logger.info('Expired password reset tokens cleaned', { modified: result.modifiedCount });
};
