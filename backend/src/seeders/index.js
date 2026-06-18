import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ROLES, TABLE_STATUS } from '../constants/enums.js';
import { Role } from '../models/Role.js';
import { User } from '../models/User.js';
import { Restaurant } from '../models/Restaurant.js';
import { Category } from '../models/Category.js';
import { MenuItem } from '../models/MenuItem.js';
import { Table } from '../models/Table.js';
import { logger } from '../utils/logger.js';

const permissions = [
  'restaurants:manage',
  'users:manage',
  'menu:manage',
  'orders:manage',
  'tables:manage',
  'reservations:manage',
  'payments:manage',
  'analytics:read',
];

const rolePermissions = {
  [ROLES.SUPER_ADMIN]: permissions,
  [ROLES.OWNER]: permissions,
  [ROLES.MANAGER]: permissions.filter((item) => item !== 'restaurants:manage'),
  [ROLES.WAITER]: ['orders:manage', 'tables:manage', 'reservations:manage'],
  [ROLES.CHEF]: ['orders:manage'],
  [ROLES.CASHIER]: ['orders:manage', 'payments:manage'],
  [ROLES.CUSTOMER]: [],
};

const seed = async () => {
  await connectDatabase();

  const roles = {};
  for (const roleName of Object.values(ROLES)) {
    roles[roleName] = await Role.findOneAndUpdate(
      { name: roleName },
      { name: roleName, permissions: rolePermissions[roleName], system: true, deletedAt: null },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const owner = await User.findOneAndUpdate(
    { email: 'owner@demo.com' },
    {
      name: 'Demo Owner',
      email: 'owner@demo.com',
      phone: '+15550000001',
      role: roles[ROLES.OWNER]._id,
      isEmailVerified: true,
      status: 'ACTIVE',
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  if (!owner.password) {
    owner.password = 'Password123!';
    await owner.save();
  }

  const restaurant = await Restaurant.findOneAndUpdate(
    { slug: 'demo-bistro' },
    {
      name: 'Demo Bistro',
      slug: 'demo-bistro',
      owner: owner._id,
      email: 'hello@demobistro.test',
      currency: 'USD',
      settings: { taxRate: 8.5, serviceChargeRate: 4, acceptsOnlineOrders: true },
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  owner.restaurant = restaurant._id;
  await owner.save();

  const categories = await Promise.all(
    ['Breakfast', 'Burgers', 'Bowls', 'Drinks'].map((name, index) =>
      Category.findOneAndUpdate(
        { restaurant: restaurant._id, slug: name.toLowerCase() },
        { restaurant: restaurant._id, name, slug: name.toLowerCase(), sortOrder: index, deletedAt: null },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  const menu = [
    ['Shakshuka Toast', categories[0]._id, 12],
    ['Smash Burger', categories[1]._id, 15],
    ['Salmon Grain Bowl', categories[2]._id, 18],
    ['Cold Brew', categories[3]._id, 5],
  ];

  await Promise.all(
    menu.map(([name, category, price]) =>
      MenuItem.findOneAndUpdate(
        { restaurant: restaurant._id, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        {
          restaurant: restaurant._id,
          category,
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          basePrice: price,
          description: `House favorite ${name.toLowerCase()}.`,
          deletedAt: null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  await Promise.all(
    Array.from({ length: 12 }).map((_, index) =>
      Table.findOneAndUpdate(
        { restaurant: restaurant._id, number: String(index + 1) },
        {
          restaurant: restaurant._id,
          number: String(index + 1),
          section: index < 6 ? 'Dining' : 'Patio',
          seats: index % 3 === 0 ? 6 : 4,
          status: TABLE_STATUS.AVAILABLE,
          deletedAt: null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  logger.info('Seed complete. Demo login: owner@demo.com / Password123!');
  await disconnectDatabase();
};

seed().catch(async (error) => {
  logger.error('Seed failed', { stack: error.stack });
  await disconnectDatabase();
  process.exit(1);
});
