import { userPanelService } from '../services/UserPanelService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/response.js';

export const userPanelController = {
  me: asyncHandler(async (req, res) => {
    const data = await userPanelService.me(req.user);
    sendSuccess(res, { message: 'Current user panel', data });
  }),

  updateMe: asyncHandler(async (req, res) => {
    const data = await userPanelService.updateMe(req.user, req.body);
    sendSuccess(res, { message: 'Profile updated', data });
  }),

  listAddresses: asyncHandler(async (req, res) => {
    const data = await userPanelService.listAddresses(req.user);
    sendSuccess(res, { message: 'Address list', data });
  }),

  addAddress: asyncHandler(async (req, res) => {
    const data = await userPanelService.addAddress(req.user, req.body);
    sendCreated(res, data, 'Address created');
  }),
};
