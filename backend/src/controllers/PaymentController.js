import { paymentService } from '../services/PaymentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated } from '../utils/response.js';

export const paymentController = {
  create: asyncHandler(async (req, res) => {
    const payment = await paymentService.create({ user: req.user, payload: req.body });
    sendCreated(res, payment, 'Payment created');
  }),
};
