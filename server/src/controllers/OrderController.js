import { orderService } from '../services/OrderService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';

export const orderController = {
  list: asyncHandler(async (req, res) => {
    ok(res, 'Orders', await orderService.list(req.user, req.query));
  }),

  get: asyncHandler(async (req, res) => {
    ok(res, 'Order detail', await orderService.get(req.user, req.params.id));
  }),

  create: asyncHandler(async (req, res) => {
    created(res, 'Order placed', await orderService.create(req.user, req.body));
  }),

  updateStatus: asyncHandler(async (req, res) => {
    ok(res, 'Order status updated', await orderService.updateStatus(req.params.id, req.body.status));
  }),

  pay: asyncHandler(async (req, res) => {
    created(res, 'Payment recorded', await orderService.pay(req.params.id, req.body));
  }),
};
