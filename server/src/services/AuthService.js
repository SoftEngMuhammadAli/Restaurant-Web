import { ROLES } from '../constants/enums.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

class AuthService {
  async register({ name, email, phone, password }) {
    const existing = await User.findOne({ email, deletedAt: null });
    if (existing) throw new ApiError(409, 'Email is already registered');

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: ROLES.CUSTOMER,
    });

    return this.createSession(user);
  }

  async login({ email, password }) {
    const user = await User.findOne({ email, deletedAt: null }).select('+password +refreshTokenHash');
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }
    if (!user.isActive) throw new ApiError(403, 'Account is disabled');

    return this.createSession(user);
  }

  async createSession(user) {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: publicUser(user),
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new ApiError(401, 'Refresh token missing');

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub).select('+refreshTokenHash');
    if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    return this.createSession(user);
  }

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
  }

  async me(userId) {
    const user = await User.findOne({ _id: userId, deletedAt: null });
    if (!user) throw new ApiError(404, 'User not found');
    return publicUser(user);
  }
}

export const authService = new AuthService();
