import { Category } from '../models/Category.js';
import { MenuItem } from '../models/MenuItem.js';
import { Table } from '../models/Table.js';
import { Reservation } from '../models/Reservation.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { Addon } from '../models/Addon.js';
import { Variant } from '../models/Variant.js';
import { BaseRepository } from './BaseRepository.js';

export const repositories = {
  categories: new BaseRepository(Category),
  menuItems: new BaseRepository(MenuItem),
  tables: new BaseRepository(Table),
  reservations: new BaseRepository(Reservation),
  orders: new BaseRepository(Order),
  payments: new BaseRepository(Payment),
  reviews: new BaseRepository(Review),
  notifications: new BaseRepository(Notification),
  users: new BaseRepository(User),
  addons: new BaseRepository(Addon),
  variants: new BaseRepository(Variant),
};
