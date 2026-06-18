import { Router } from 'express';
import { authController } from '../controllers/AuthController.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  tokenSchema,
} from '../validators/auth.validator.js';

export const authRouter = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register owner or customer account.
 */
authRouter.post('/register', authLimiter, validate(registerSchema), authController.register);
authRouter.post('/login', authLimiter, validate(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.post('/verify-email', validate(tokenSchema), authController.verifyEmail);
authRouter.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);
authRouter.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);
