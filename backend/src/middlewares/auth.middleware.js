import { verifyAccessToken } from '../utils/tokens.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) throw new ApiError(401, 'Authentication required');

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).populate('role').lean();

    if (!user || user.deletedAt) throw new ApiError(401, 'Invalid session');

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role?.name || payload.role,
      permissions: user.role?.permissions || [],
      restaurant: user.restaurant?.toString(),
    };

    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, 'Invalid or expired access token'));
  }
};

export const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }
  return next();
};

export const authorizePermissions = (...permissions) => (req, _res, next) => {
  const hasPermission = permissions.every((permission) => req.user?.permissions?.includes(permission));
  if (!hasPermission) return next(new ApiError(403, 'Missing required permission'));
  return next();
};
