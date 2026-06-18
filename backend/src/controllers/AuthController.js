import { authService } from '../services/AuthService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    sendSuccess(res, { statusCode: 201, message: 'Registered successfully', data: result });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    sendSuccess(res, { message: 'Logged in successfully', data: result });
  }),

  refresh: asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const result = await authService.refresh(token);
    res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
    sendSuccess(res, { message: 'Token refreshed', data: result });
  }),

  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    sendSuccess(res, { message: 'Logged out successfully' });
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    await authService.verifyEmail(req.body.token);
    sendSuccess(res, { message: 'Email verified' });
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    sendSuccess(res, { message: 'Password reset instructions sent' });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body);
    sendSuccess(res, { message: 'Password reset successfully' });
  }),

  changePassword: asyncHandler(async (req, res) => {
    await authService.changePassword({ userId: req.user.id, ...req.body });
    sendSuccess(res, { message: 'Password changed successfully' });
  }),
};
