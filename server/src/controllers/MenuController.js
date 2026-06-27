import { menuService } from '../services/MenuService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { created, ok } from '../utils/response.js';

export const menuController = {
  home: asyncHandler(async (_req, res) => {
    ok(res, 'Marketplace home', await menuService.home());
  }),

  promotions: asyncHandler(async (req, res) => {
    ok(res, 'Promotions', await menuService.promotions(req.query));
  }),

  restaurants: asyncHandler(async (req, res) => {
    ok(res, 'Restaurants', await menuService.restaurants(req.query));
  }),

  restaurant: asyncHandler(async (req, res) => {
    ok(res, 'Restaurant', await menuService.restaurant(req.params.slug));
  }),

  restaurantMenu: asyncHandler(async (req, res) => {
    ok(res, 'Restaurant menu', await menuService.restaurantMenu(req.params.slug, req.query));
  }),

  categories: asyncHandler(async (_req, res) => {
    ok(res, 'Categories', await menuService.categories());
  }),

  menuItems: asyncHandler(async (req, res) => {
    ok(res, 'Menu items', await menuService.menuItems(req.query));
  }),

  createCategory: asyncHandler(async (req, res) => {
    created(res, 'Category created', await menuService.createCategory(req.body));
  }),

  createMenuItem: asyncHandler(async (req, res) => {
    created(res, 'Menu item created', await menuService.createMenuItem(req.body));
  }),

  updateMenuItem: asyncHandler(async (req, res) => {
    ok(res, 'Menu item updated', await menuService.updateMenuItem(req.params.id, req.body));
  }),

  removeMenuItem: asyncHandler(async (req, res) => {
    ok(res, 'Menu item removed', await menuService.removeMenuItem(req.params.id));
  }),
};
