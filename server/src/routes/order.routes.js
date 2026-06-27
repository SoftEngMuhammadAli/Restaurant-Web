import { Router } from 'express';
import { orderController } from '../controllers/OrderController.js';
import { adminOnly, authenticate, staffOnly } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParam, orderSchema, orderStatusSchema, paymentSchema } from '../validators/schemas.js';

export const orderRouter = Router();

orderRouter.get('/', authenticate, orderController.list);
orderRouter.get('/:id', authenticate, validate(idParam), orderController.get);
orderRouter.post('/', authenticate, validate(orderSchema), orderController.create);
orderRouter.patch('/:id/status', authenticate, staffOnly, validate(orderStatusSchema), orderController.updateStatus);
orderRouter.post('/:id/pay', authenticate, adminOnly, validate(paymentSchema), orderController.pay);
