import { Address } from '../models/Address.js';
import { CustomerProfile } from '../models/CustomerProfile.js';
import { Notification } from '../models/Notification.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

class UserPanelService {
  async me(userContext) {
    const user = await User.findOne({ _id: userContext.id, deletedAt: null }).populate('role restaurant');
    if (!user) throw new ApiError(404, 'User not found');

    const [profile, addresses, recentOrders, unreadNotifications] = await Promise.all([
      CustomerProfile.findOne({ user: user._id, deletedAt: null }),
      Address.find({ user: user._id, deletedAt: null }).sort('-isDefault -createdAt'),
      Order.find({ customer: user._id, deletedAt: null }).sort('-createdAt').limit(5),
      Notification.countDocuments({ user: user._id, readAt: null, deletedAt: null }),
    ]);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role?.name,
        restaurant: user.restaurant,
        isEmailVerified: user.isEmailVerified,
      },
      profile,
      addresses,
      recentOrders,
      stats: {
        loyaltyPoints: profile?.loyaltyPoints || 0,
        savedAddresses: addresses.length,
        recentOrders: recentOrders.length,
        unreadNotifications,
      },
    };
  }

  async updateMe(userContext, payload) {
    const user = await User.findOneAndUpdate(
      { _id: userContext.id, deletedAt: null },
      {
        name: payload.name,
        phone: payload.phone,
      },
      { new: true, runValidators: true },
    ).populate('role restaurant');

    if (!user) throw new ApiError(404, 'User not found');

    await CustomerProfile.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        restaurant: user.restaurant?._id || user.restaurant,
        preferences: payload.preferences || [],
        notes: payload.notes,
        deletedAt: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return this.me(userContext);
  }

  listAddresses(userContext) {
    return Address.find({ user: userContext.id, deletedAt: null }).sort('-isDefault -createdAt');
  }

  async addAddress(userContext, payload) {
    if (payload.isDefault) {
      await Address.updateMany({ user: userContext.id }, { isDefault: false });
    }

    return Address.create({
      ...payload,
      user: userContext.id,
    });
  }
}

export const userPanelService = new UserPanelService();
