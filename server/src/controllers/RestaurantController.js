import { restaurantService } from '../services/RestaurantService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';

export const restaurantController = {
  info: asyncHandler(async (_req, res) => ok(res, 'Restaurant info', restaurantService.info())),
  reviews: asyncHandler(async (_req, res) => ok(res, 'Reviews', await restaurantService.reviews())),
  dashboard: asyncHandler(async (_req, res) => ok(res, 'Dashboard', await restaurantService.dashboard())),
  tables: asyncHandler(async (_req, res) => ok(res, 'Tables', await restaurantService.tables())),
  updateTableStatus: asyncHandler(async (req, res) => {
    ok(res, 'Table status updated', await restaurantService.updateTableStatus(req.params.id, req.body.status));
  }),
  reservations: asyncHandler(async (_req, res) => ok(res, 'Reservations', await restaurantService.reservations())),
  createReservation: asyncHandler(async (req, res) => {
    created(res, 'Reservation requested', await restaurantService.createReservation(req.user, req.body));
  }),
  customers: asyncHandler(async (_req, res) => ok(res, 'Customers', await restaurantService.customers())),
  profile: asyncHandler(async (req, res) => ok(res, 'Profile', await restaurantService.profile(req.user.id))),
  addAddress: asyncHandler(async (req, res) => {
    created(res, 'Address saved', await restaurantService.addAddress(req.user.id, req.body));
  }),
};
