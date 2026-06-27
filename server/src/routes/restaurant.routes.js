import { Router } from 'express';
import { restaurantController } from '../controllers/RestaurantController.js';
import { adminOnly, authenticate, optionalAuth, staffOnly } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addressSchema, reservationSchema, tableStatusSchema } from '../validators/schemas.js';

export const restaurantRouter = Router();

restaurantRouter.get('/info', restaurantController.info);
restaurantRouter.get('/reviews', restaurantController.reviews);
restaurantRouter.get('/tables', authenticate, staffOnly, restaurantController.tables);
restaurantRouter.patch('/tables/:id/status', authenticate, staffOnly, validate(tableStatusSchema), restaurantController.updateTableStatus);
restaurantRouter.get('/reservations', authenticate, staffOnly, restaurantController.reservations);
restaurantRouter.post('/reservations', optionalAuth, validate(reservationSchema), restaurantController.createReservation);
restaurantRouter.get('/dashboard', authenticate, adminOnly, restaurantController.dashboard);
restaurantRouter.get('/customers', authenticate, adminOnly, restaurantController.customers);
restaurantRouter.get('/profile', authenticate, restaurantController.profile);
restaurantRouter.post('/profile/addresses', authenticate, validate(addressSchema), restaurantController.addAddress);
