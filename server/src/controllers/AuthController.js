import { authService } from '../services/AuthService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/response.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  register: asyncHandler(async (req, res) => {
    const session = await authService.register(req.body);
    res.cookie('refreshToken', session.refreshToken, cookieOptions);
    created(res, 'Account created', session);
  }),

  login: asyncHandler(async (req, res) => {
    const session = await authService.login(req.body);
    res.cookie('refreshToken', session.refreshToken, cookieOptions);
    ok(res, 'Logged in', session);
  }),

  refresh: asyncHandler(async (req, res) => {
    const session = await authService.refresh(req.cookies.refreshToken || req.body.refreshToken);
    res.cookie('refreshToken', session.refreshToken, cookieOptions);
    ok(res, 'Token refreshed', session);
  }),

  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    ok(res, 'Logged out');
  }),

  me: asyncHandler(async (req, res) => {
    ok(res, 'Current user', await authService.me(req.user.id));
  }),
};
