import { Router } from 'express';
import { menuController } from '../controllers/MenuController.js';
import { adminOnly } from '../middlewares/auth.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { categorySchema, idParam, menuItemSchema } from '../validators/schemas.js';

export const menuRouter = Router();

menuRouter.get('/home', menuController.home);
menuRouter.get('/promotions', menuController.promotions);
menuRouter.get('/restaurants', menuController.restaurants);
menuRouter.get('/restaurants/:slug', menuController.restaurant);
menuRouter.get('/restaurants/:slug/menu', menuController.restaurantMenu);
menuRouter.get('/categories', menuController.categories);
menuRouter.get('/items', menuController.menuItems);
menuRouter.post('/categories', authenticate, adminOnly, validate(categorySchema), menuController.createCategory);
menuRouter.post('/items', authenticate, adminOnly, validate(menuItemSchema), menuController.createMenuItem);
menuRouter.put('/items/:id', authenticate, adminOnly, validate(menuItemSchema), menuController.updateMenuItem);
menuRouter.delete('/items/:id', authenticate, adminOnly, validate(idParam), menuController.removeMenuItem);
