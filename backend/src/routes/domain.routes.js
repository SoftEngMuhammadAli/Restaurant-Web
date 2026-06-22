import { Router } from 'express';
import { CrudController } from '../controllers/CrudController.js';
import { orderController } from '../controllers/OrderController.js';
import { tableController } from '../controllers/TableController.js';
import { paymentController } from '../controllers/PaymentController.js';
import { analyticsController } from '../controllers/AnalyticsController.js';
import { uploadController } from '../controllers/UploadController.js';
import { userPanelController } from '../controllers/UserPanelController.js';
import { upload } from '../middlewares/upload.middleware.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCrudRouter } from './crudRouteFactory.js';
import { CrudService } from '../services/CrudService.js';
import { customerService } from '../services/CustomerService.js';
import { repositories } from '../repositories/domainRepositories.js';
import { ROLES } from '../constants/enums.js';
import {
  categorySchema,
  addonSchema,
  customerSchema,
  menuItemSchema,
  notificationSchema,
  orderSchema,
  orderStatusSchema,
  paymentSchema,
  reservationSchema,
  reviewSchema,
  restaurantSchema,
  roleSchema,
  addressSchema,
  tableSchema,
  tableStatusSchema,
  userProfileSchema,
  variantSchema,
} from '../validators/domain.validator.js';
import { listQuerySchema, idParamSchema } from '../validators/common.validator.js';

const router = Router();
const staff = [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.CASHIER, ROLES.WAITER];
const managers = [ROLES.SUPER_ADMIN, ROLES.OWNER, ROLES.MANAGER];

const categoryController = new CrudController(
  new CrudService(repositories.categories, { searchableFields: ['name', 'description'] }),
  'Category',
);
const menuItemController = new CrudController(
  new CrudService(repositories.menuItems, { searchableFields: ['name', 'description', 'tags'] }),
  'Menu item',
);
const reservationController = new CrudController(
  new CrudService(repositories.reservations, { searchableFields: ['guestName', 'guestPhone'] }),
  'Reservation',
);
const customerController = new CrudController(customerService, 'Customer');
const reviewController = new CrudController(new CrudService(repositories.reviews), 'Review');
const notificationController = new CrudController(
  new CrudService(repositories.notifications),
  'Notification',
);
const addonController = new CrudController(
  new CrudService(repositories.addons, { searchableFields: ['name'] }),
  'Addon',
);
const variantController = new CrudController(
  new CrudService(repositories.variants, { searchableFields: ['name', 'sku'] }),
  'Variant',
);
const restaurantController = new CrudController(
  new CrudService(repositories.restaurants, {
    scopeByRestaurant: false,
    searchableFields: ['name', 'slug'],
  }),
  'Restaurant',
);
const roleController = new CrudController(
  new CrudService(repositories.roles, { scopeByRestaurant: false, searchableFields: ['name'] }),
  'Role',
);

router.get('/me', authenticate, userPanelController.me);
router.put('/me', authenticate, validate(userProfileSchema), userPanelController.updateMe);
router.get('/me/addresses', authenticate, userPanelController.listAddresses);
router.post('/me/addresses', authenticate, validate(addressSchema), userPanelController.addAddress);

router.use(
  '/restaurants',
  createCrudRouter({
    controller: restaurantController,
    createSchema: restaurantSchema,
    roles: [ROLES.SUPER_ADMIN],
  }),
);
router.use(
  '/roles',
  createCrudRouter({
    controller: roleController,
    createSchema: roleSchema,
    roles: [ROLES.SUPER_ADMIN],
  }),
);

// Public routes - customers can browse without authentication
router.get('/categories', validate(listQuerySchema), categoryController.list);
router.get('/categories/:id', validate(idParamSchema), categoryController.get);
router.get('/menu-items', validate(listQuerySchema), menuItemController.list);
router.get('/menu-items/:id', validate(idParamSchema), menuItemController.get);

// Protected CRUD routes
router.post(
  '/categories',
  authenticate,
  authorizeRoles(...managers),
  validate(categorySchema),
  categoryController.create,
);
router.put(
  '/categories/:id',
  authenticate,
  authorizeRoles(...managers),
  validate(categorySchema),
  categoryController.update,
);
router.delete(
  '/categories/:id',
  authenticate,
  authorizeRoles(...managers),
  validate(idParamSchema),
  categoryController.remove,
);

router.post(
  '/menu-items',
  authenticate,
  authorizeRoles(...managers),
  validate(menuItemSchema),
  menuItemController.create,
);
router.put(
  '/menu-items/:id',
  authenticate,
  authorizeRoles(...managers),
  validate(menuItemSchema),
  menuItemController.update,
);
router.delete(
  '/menu-items/:id',
  authenticate,
  authorizeRoles(...managers),
  validate(idParamSchema),
  menuItemController.remove,
);

router.use('/addons', createCrudRouter({ controller: addonController, createSchema: addonSchema }));
router.use(
  '/variants',
  createCrudRouter({ controller: variantController, createSchema: variantSchema }),
);
router.use(
  '/tables',
  createCrudRouter({ controller: tableController, createSchema: tableSchema, roles: staff }),
);
router.patch(
  '/tables/:id/status',
  authenticate,
  authorizeRoles(...staff),
  validate(tableStatusSchema),
  tableController.updateStatus,
);
router.use(
  '/reservations',
  createCrudRouter({
    controller: reservationController,
    createSchema: reservationSchema,
    roles: staff,
  }),
);
router.use(
  '/customers',
  createCrudRouter({
    controller: customerController,
    createSchema: customerSchema,
    roles: managers,
  }),
);
router.use(
  '/reviews',
  createCrudRouter({ controller: reviewController, createSchema: reviewSchema, roles: staff }),
);
router.use(
  '/notifications',
  createCrudRouter({
    controller: notificationController,
    createSchema: notificationSchema,
    roles: staff,
  }),
);

router.get('/orders', authenticate, validate(listQuerySchema), orderController.list);
router.get('/orders/:id', authenticate, validate(idParamSchema), orderController.get);
router.post(
  '/orders',
  authenticate,
  authorizeRoles(...staff, ROLES.CUSTOMER),
  validate(orderSchema),
  orderController.create,
);
router.patch(
  '/orders/:id/status',
  authenticate,
  authorizeRoles(...staff, ROLES.CHEF),
  validate(orderStatusSchema),
  orderController.updateStatus,
);

router.post(
  '/payments',
  authenticate,
  authorizeRoles(...staff, ROLES.CUSTOMER),
  validate(paymentSchema),
  paymentController.create,
);
router.get(
  '/analytics/dashboard',
  authenticate,
  authorizeRoles(...managers),
  analyticsController.dashboard,
);
router.post(
  '/uploads/images',
  authenticate,
  authorizeRoles(...managers),
  upload.single('image'),
  uploadController.image,
);

export const domainRouter = router;
