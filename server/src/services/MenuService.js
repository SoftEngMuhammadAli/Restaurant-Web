import { Category } from '../models/Category.js';
import { MenuItem } from '../models/MenuItem.js';
import { Promotion } from '../models/Promotion.js';
import { Restaurant } from '../models/Restaurant.js';
import { ApiError } from '../utils/ApiError.js';

const isObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ''));

class MenuService {
  async home() {
    const [promotions, restaurants, categories, popularItems] = await Promise.all([
      this.promotions(),
      this.restaurants({ featured: 'true', limit: 8 }),
      this.categories(),
      this.menuItems({ featured: 'true', available: 'true', limit: 8 }),
    ]);

    const cuisines = [...new Set(restaurants.map((restaurant) => restaurant.cuisine))].filter(Boolean);
    return { promotions, restaurants, categories, cuisines, popularItems };
  }

  promotions(query = {}) {
    const filter = { deletedAt: null, isActive: true };
    if (query.placement) filter.placement = query.placement;
    return Promotion.find(filter).populate('restaurant').sort('sortOrder createdAt').limit(Number(query.limit || 12));
  }

  restaurants(query = {}) {
    const filter = { deletedAt: null };
    if (query.open === 'true') filter.isOpen = true;
    if (query.featured === 'true') filter.isFeatured = true;
    if (query.cuisine) filter.cuisine = new RegExp(query.cuisine, 'i');
    if (query.search) filter.$text = { $search: query.search };

    return Restaurant.find(filter)
      .sort('-isFeatured -rating name')
      .limit(Number(query.limit || 60));
  }

  async restaurant(identifier) {
    const filter = isObjectId(identifier) ? { _id: identifier } : { slug: identifier };
    const restaurant = await Restaurant.findOne({ ...filter, deletedAt: null });
    if (!restaurant) throw new ApiError(404, 'Restaurant not found');
    return restaurant;
  }

  async restaurantMenu(identifier, query = {}) {
    const restaurant = await this.restaurant(identifier);
    const items = await this.menuItems({ ...query, restaurant: restaurant._id, available: 'true' });
    return { restaurant, items };
  }

  async categories() {
    return Category.find({ deletedAt: null, isActive: true }).sort('sortOrder name');
  }

  async menuItems(query = {}) {
    const filter = { deletedAt: null };
    if (query.restaurant) filter.restaurant = query.restaurant;
    if (query.available === 'true') filter.isAvailable = true;
    if (query.featured === 'true') filter.isFeatured = true;
    if (query.category) filter.category = query.category;
    if (query.search) filter.$text = { $search: query.search };

    return MenuItem.find(filter)
      .populate('category restaurant')
      .sort('-isFeatured name')
      .limit(Number(query.limit || 100));
  }

  async createCategory(payload) {
    return Category.create(payload);
  }

  async createMenuItem(payload) {
    const category = await Category.findOne({ _id: payload.category, deletedAt: null });
    if (!category) throw new ApiError(404, 'Category not found');
    const restaurant = await Restaurant.findOne({ _id: payload.restaurant, deletedAt: null });
    if (!restaurant) throw new ApiError(404, 'Restaurant not found');
    return MenuItem.create(payload);
  }

  async updateMenuItem(id, payload) {
    const item = await MenuItem.findOneAndUpdate({ _id: id, deletedAt: null }, payload, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new ApiError(404, 'Menu item not found');
    return item;
  }

  async removeMenuItem(id) {
    const item = await MenuItem.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    );
    if (!item) throw new ApiError(404, 'Menu item not found');
    return item;
  }
}

export const menuService = new MenuService();
