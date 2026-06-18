import { analyticsService } from '../services/AnalyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const analyticsController = {
  dashboard: asyncHandler(async (req, res) => {
    const data = await analyticsService.dashboard(req.user);
    sendSuccess(res, { message: 'Dashboard analytics', data });
  }),
};
