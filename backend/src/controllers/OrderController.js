import { orderService } from '../services/OrderService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/response.js';

export const orderController = {
  list: asyncHandler(async (req, res) => {
    const result = await orderService.list({ user: req.user, query: req.query });
    sendSuccess(res, { message: 'Order list', data: result.items, meta: result.meta });
  }),
  create: asyncHandler(async (req, res) => {
    const order = await orderService.create({ user: req.user, payload: req.body });
    sendCreated(res, order, 'Order created');
  }),
  updateStatus: asyncHandler(async (req, res) => {
    const order = await orderService.updateStatus({ user: req.user, id: req.params.id, status: req.body.status });
    sendSuccess(res, { message: 'Order status updated', data: order });
  }),
};
