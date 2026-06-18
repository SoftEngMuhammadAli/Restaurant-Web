import { ApiError } from '../utils/ApiError.js';
import { createOpaqueToken, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { sendEmail } from '../utils/email.js';
import { slugify } from '../utils/slugify.js';
import { ROLES } from '../constants/enums.js';
import { User } from '../models/User.js';
import { Restaurant } from '../models/Restaurant.js';
import { roleRepository } from '../repositories/RoleRepository.js';
import { userRepository } from '../repositories/UserRepository.js';

class AuthService {
  async register(payload) {
    const existing = await userRepository.findOne({ email: payload.email });
    if (existing) throw new ApiError(409, 'Email is already registered');

    const role = await roleRepository.findByName(payload.role || ROLES.OWNER);
    if (!role) throw new ApiError(500, 'Default role is missing. Run seeders first.');

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: role._id,
    });

    if (role.name === ROLES.OWNER) {
      const restaurant = await Restaurant.create({
        name: payload.restaurantName || `${payload.name}'s Restaurant`,
        slug: `${slugify(payload.restaurantName || payload.name)}-${Date.now()}`,
        owner: user._id,
        email: payload.email,
      });
      user.restaurant = restaurant._id;
      await user.save();
    }

    const verificationToken = createOpaqueToken();
    user.emailVerificationToken = hashToken(verificationToken);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Verify your restaurant account',
      html: `<p>Use this token to verify your account:</p><strong>${verificationToken}</strong>`,
    });

    return this.issueSession(user);
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmailWithSecrets(email);
    if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password');
    if (user.status !== 'ACTIVE') throw new ApiError(403, 'User account is not active');

    user.lastLoginAt = new Date();
    await user.save();

    return this.issueSession(user);
  }

  async issueSession(user) {
    await user.populate('role');
    const payload = {
      sub: user._id.toString(),
      role: user.role.name,
      restaurant: user.restaurant?.toString(),
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: this.serializeUser(user),
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new ApiError(401, 'Refresh token missing');
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub).select('+refreshTokenHash').populate('role');
    if (!user || user.refreshTokenHash !== hashToken(refreshToken)) throw new ApiError(401, 'Invalid refresh token');
    return this.issueSession(user);
  }

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
  }

  async verifyEmail(token) {
    const user = await User.findOne({ emailVerificationToken: hashToken(token), deletedAt: null }).select(
      '+emailVerificationToken',
    );
    if (!user) throw new ApiError(400, 'Invalid verification token');
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    return true;
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmailWithSecrets(email);
    if (!user) return true;
    const resetToken = createOpaqueToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Use this token to reset your password:</p><strong>${resetToken}</strong>`,
    });
    return true;
  }

  async resetPassword({ token, password }) {
    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
      deletedAt: null,
    }).select('+passwordResetToken +password');
    if (!user) throw new ApiError(400, 'Invalid or expired reset token');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return true;
  }

  async changePassword({ userId, currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) throw new ApiError(401, 'Current password is incorrect');
    user.password = newPassword;
    await user.save();
    return true;
  }

  serializeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
      restaurant: user.restaurant,
      isEmailVerified: user.isEmailVerified,
    };
  }
}

export const authService = new AuthService();
