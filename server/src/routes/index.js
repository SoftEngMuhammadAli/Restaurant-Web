import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { menuRouter } from './menu.routes.js';
import { orderRouter } from './order.routes.js';
import { restaurantRouter } from './restaurant.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/menu', menuRouter);
router.use('/orders', orderRouter);
router.use('/restaurant', restaurantRouter);
