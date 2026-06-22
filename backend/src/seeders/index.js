import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ORDER_STATUS, PAYMENT_STATUS, ROLES, TABLE_STATUS } from '../constants/enums.js';
import { Addon } from '../models/Addon.js';
import { Address } from '../models/Address.js';
import { Category } from '../models/Category.js';
import { CustomerProfile } from '../models/CustomerProfile.js';
import { MenuItem } from '../models/MenuItem.js';
import { Notification } from '../models/Notification.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Reservation } from '../models/Reservation.js';
import { Restaurant } from '../models/Restaurant.js';
import { Review } from '../models/Review.js';
import { Role } from '../models/Role.js';
import { Table } from '../models/Table.js';
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { Variant } from '../models/Variant.js';
import { logger } from '../utils/logger.js';

const demoPassword = 'Password123!';

const permissions = [
  'restaurants:manage',
  'users:manage',
  'menu:manage',
  'orders:manage',
  'tables:manage',
  'reservations:manage',
  'payments:manage',
  'analytics:read',
  'notifications:manage',
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

const upsertUser = async ({ email, name, phone, role, restaurant, isEmailVerified = true }) => {
  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    user = new User({
      email,
      name,
      phone,
      role,
      restaurant,
      password: demoPassword,
      isEmailVerified,
      status: 'ACTIVE',
      deletedAt: null,
    });
  } else {
    user.name = name;
    user.phone = phone;
    user.role = role;
    user.restaurant = restaurant;
    user.password = demoPassword;
    user.isEmailVerified = isEmailVerified;
    user.status = 'ACTIVE';
    user.deletedAt = null;
  }

  await user.save();
  return user;
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

  const superAdmin = await upsertUser({
    email: 'superadmin@demo.com',
    name: 'SaaS Super Admin',
    phone: '+15550000000',
    role: roles[ROLES.SUPER_ADMIN]._id,
  });

  const restaurant = await Restaurant.findOneAndUpdate(
    { slug: 'demo-bistro' },
    {
      name: 'Demo Bistro',
      slug: 'demo-bistro',
      owner: superAdmin._id,
      phone: '+15551234567',
      email: 'hello@demobistro.test',
      currency: 'USD',
      timezone: 'America/New_York',
      logoUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=85',
      address: {
        line1: '14 Market Street',
        city: 'New York',
        state: 'NY',
        country: 'US',
        postalCode: '10001',
      },
      settings: { taxRate: 8.5, serviceChargeRate: 4, acceptsOnlineOrders: true },
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const users = {
    owner: await upsertUser({
      email: 'owner@demo.com',
      name: 'Demo Owner',
      phone: '+15550000001',
      role: roles[ROLES.OWNER]._id,
      restaurant: restaurant._id,
    }),
    manager: await upsertUser({
      email: 'manager@demo.com',
      name: 'Maya Manager',
      phone: '+15550000002',
      role: roles[ROLES.MANAGER]._id,
      restaurant: restaurant._id,
    }),
    waiter: await upsertUser({
      email: 'waiter@demo.com',
      name: 'Wade Waiter',
      phone: '+15550000003',
      role: roles[ROLES.WAITER]._id,
      restaurant: restaurant._id,
    }),
    chef: await upsertUser({
      email: 'chef@demo.com',
      name: 'Chris Chef',
      phone: '+15550000004',
      role: roles[ROLES.CHEF]._id,
      restaurant: restaurant._id,
    }),
    cashier: await upsertUser({
      email: 'cashier@demo.com',
      name: 'Cara Cashier',
      phone: '+15550000005',
      role: roles[ROLES.CASHIER]._id,
      restaurant: restaurant._id,
    }),
    ariana: await upsertUser({
      email: 'ariana@example.com',
      name: 'Ariana Chen',
      phone: '+15550000031',
      role: roles[ROLES.CUSTOMER]._id,
      restaurant: restaurant._id,
    }),
    miles: await upsertUser({
      email: 'miles@example.com',
      name: 'Miles Khan',
      phone: '+15550000032',
      role: roles[ROLES.CUSTOMER]._id,
      restaurant: restaurant._id,
    }),
    nora: await upsertUser({
      email: 'nora@example.com',
      name: 'Nora Patel',
      phone: '+15550000033',
      role: roles[ROLES.CUSTOMER]._id,
      restaurant: restaurant._id,
    }),
  };

  restaurant.owner = users.owner._id;
  await restaurant.save();

  const categorySeeds = [
    ['Breakfast', 'breakfast', 'Bright morning plates and coffee pairings.'],
    ['Burgers', 'burgers', 'Signature burgers, fries, and sauces.'],
    ['Bowls', 'bowls', 'Fresh grain bowls and salads.'],
    ['Drinks', 'drinks', 'Coffee, tea, mocktails, and juices.'],
    ['Desserts', 'desserts', 'Finishers from the pastry station.'],
  ];

  const categories = {};
  for (const [name, slug, description] of categorySeeds) {
    categories[slug] = await Category.findOneAndUpdate(
      { restaurant: restaurant._id, slug },
      { restaurant: restaurant._id, name, slug, description, isActive: true, deletedAt: null },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const addons = {};
  for (const addon of [
    ['Extra cheese', 2],
    ['Avocado', 3],
    ['House sauce', 1.5],
    ['Crispy fries', 4],
    ['Plant-based patty', 4],
  ]) {
    addons[addon[0]] = await Addon.findOneAndUpdate(
      { restaurant: restaurant._id, name: addon[0] },
      { restaurant: restaurant._id, name: addon[0], price: addon[1], isActive: true, deletedAt: null },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const menuSeeds = [
    {
      name: 'Shakshuka Toast',
      slug: 'shakshuka-toast',
      category: categories.breakfast._id,
      basePrice: 12,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
      description: 'Sourdough, spiced tomato, poached eggs, herbs, and feta.',
      tags: ['breakfast', 'vegetarian'],
    },
    {
      name: 'Smash Burger',
      slug: 'smash-burger',
      category: categories.burgers._id,
      basePrice: 15,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      description: 'Double patty, cheddar, pickles, onion, and house sauce.',
      tags: ['popular', 'beef'],
    },
    {
      name: 'Salmon Grain Bowl',
      slug: 'salmon-grain-bowl',
      category: categories.bowls._id,
      basePrice: 18,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      description: 'Miso salmon, quinoa, cucumber, greens, and citrus dressing.',
      tags: ['healthy', 'seafood'],
    },
    {
      name: 'Cold Brew',
      slug: 'cold-brew',
      category: categories.drinks._id,
      basePrice: 5,
      imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
      description: 'Slow-steeped coffee over ice.',
      tags: ['coffee'],
    },
    {
      name: 'Chocolate Basque Cheesecake',
      slug: 'chocolate-basque-cheesecake',
      category: categories.desserts._id,
      basePrice: 9,
      imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
      description: 'Burnt top cheesecake with dark chocolate and sea salt.',
      tags: ['dessert'],
    },
  ];

  const menuItems = {};
  for (const item of menuSeeds) {
    menuItems[item.slug] = await MenuItem.findOneAndUpdate(
      { restaurant: restaurant._id, slug: item.slug },
      {
        restaurant: restaurant._id,
        category: item.category,
        name: item.name,
        slug: item.slug,
        description: item.description,
        basePrice: item.basePrice,
        imageUrl: item.imageUrl,
        tags: item.tags,
        addons: [addons['Extra cheese']._id, addons['House sauce']._id],
        isAvailable: true,
        prepTimeMinutes: item.slug === 'cold-brew' ? 3 : 15,
        deletedAt: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  for (const [name, price, menuItem, isDefault] of [
    ['Regular', 15, menuItems['smash-burger']._id, true],
    ['Double', 19, menuItems['smash-burger']._id, false],
    ['Small', 14, menuItems['salmon-grain-bowl']._id, false],
    ['Regular', 18, menuItems['salmon-grain-bowl']._id, true],
  ]) {
    await Variant.findOneAndUpdate(
      { restaurant: restaurant._id, menuItem, name },
      { restaurant: restaurant._id, menuItem, name, price, isDefault, deletedAt: null },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const tables = [];
  for (let index = 1; index <= 16; index += 1) {
    tables.push(
      await Table.findOneAndUpdate(
        { restaurant: restaurant._id, number: String(index) },
        {
          restaurant: restaurant._id,
          number: String(index),
          section: index <= 8 ? 'Dining' : 'Patio',
          seats: index % 4 === 0 ? 6 : 4,
          status: [TABLE_STATUS.AVAILABLE, TABLE_STATUS.OCCUPIED, TABLE_STATUS.RESERVED, TABLE_STATUS.MAINTENANCE][index % 4],
          deletedAt: null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    );
  }

  await Promise.all(
    [users.ariana, users.miles, users.nora].map((customer, index) =>
      CustomerProfile.findOneAndUpdate(
        { user: customer._id },
        {
          user: customer._id,
          restaurant: restaurant._id,
          loyaltyPoints: [860, 420, 1240][index],
          preferences: index === 0 ? ['No onions', 'Window seating'] : ['Fast delivery'],
          notes: 'Seeded customer profile.',
          deletedAt: null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  await Promise.all(
    [
      [users.ariana, 'Home', '82 Grove Street', 'New York', 'NY', 'US', '10002', true],
      [users.miles, 'Office', '19 Hudson Yard', 'New York', 'NY', 'US', '10018', true],
      [users.nora, 'Apartment', '44 Park Avenue', 'New York', 'NY', 'US', '10016', true],
    ].map(([user, label, line1, city, state, country, postalCode, isDefault]) =>
      Address.findOneAndUpdate(
        { user: user._id, label },
        { user: user._id, label, line1, city, state, country, postalCode, isDefault, deletedAt: null },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  const now = Date.now();
  await Promise.all(
    [
      [users.nora, tables[5], 'CONFIRMED', now + 2 * 60 * 60 * 1000],
      [users.miles, tables[1], 'PENDING', now + 3 * 60 * 60 * 1000],
      [users.ariana, tables[9], 'CONFIRMED', now + 4 * 60 * 60 * 1000],
    ].map(([customer, table, status, startsAt]) =>
      Reservation.findOneAndUpdate(
        { restaurant: restaurant._id, customer: customer._id, startsAt: new Date(startsAt) },
        {
          restaurant: restaurant._id,
          table: table._id,
          customer: customer._id,
          guestName: customer.name,
          guestPhone: customer.phone,
          guestEmail: customer.email,
          partySize: table.seats,
          startsAt: new Date(startsAt),
          endsAt: new Date(startsAt + 90 * 60 * 1000),
          status,
          notes: 'Seed reservation.',
          deletedAt: null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  const orderSeeds = [
    {
      orderNumber: 'ORD-DEMO-1001',
      customer: users.ariana,
      table: tables[3],
      status: ORDER_STATUS.PREPARING,
      type: 'DINE_IN',
      rows: [
        [menuItems['smash-burger'], 2],
        [menuItems['cold-brew'], 2],
      ],
    },
    {
      orderNumber: 'ORD-DEMO-1002',
      customer: users.miles,
      table: null,
      status: ORDER_STATUS.READY,
      type: 'TAKEAWAY',
      rows: [
        [menuItems['salmon-grain-bowl'], 1],
        [menuItems['chocolate-basque-cheesecake'], 1],
      ],
    },
    {
      orderNumber: 'ORD-DEMO-1003',
      customer: users.nora,
      table: tables[7],
      status: ORDER_STATUS.COMPLETED,
      type: 'DINE_IN',
      rows: [
        [menuItems['shakshuka-toast'], 2],
        [menuItems['cold-brew'], 1],
      ],
    },
  ];

  const orders = [];
  for (const seedOrder of orderSeeds) {
    const items = seedOrder.rows.map(([menuItem, quantity]) => ({
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity,
      unitPrice: menuItem.basePrice,
      addons: [],
      status: seedOrder.status === ORDER_STATUS.COMPLETED ? 'SERVED' : 'QUEUED',
    }));
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const taxTotal = Number((subtotal * 0.085).toFixed(2));
    const serviceCharge = Number((subtotal * 0.04).toFixed(2));
    const grandTotal = Number((subtotal + taxTotal + serviceCharge).toFixed(2));

    orders.push(
      await Order.findOneAndUpdate(
        { orderNumber: seedOrder.orderNumber },
        {
          restaurant: restaurant._id,
          orderNumber: seedOrder.orderNumber,
          customer: seedOrder.customer._id,
          table: seedOrder.table?._id,
          type: seedOrder.type,
          items,
          status: seedOrder.status,
          subtotal,
          taxTotal,
          serviceCharge,
          discountTotal: 0,
          grandTotal,
          paymentStatus: seedOrder.status === ORDER_STATUS.COMPLETED ? 'PAID' : 'UNPAID',
          deletedAt: null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    );
  }

  const paidOrder = orders.find((order) => order.status === ORDER_STATUS.COMPLETED);
  const payment = await Payment.findOneAndUpdate(
    { order: paidOrder._id },
    {
      restaurant: restaurant._id,
      order: paidOrder._id,
      provider: 'CASH',
      amount: paidOrder.grandTotal,
      currency: 'USD',
      status: PAYMENT_STATUS.PAID,
      providerReference: 'cash-demo-1003',
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Transaction.findOneAndUpdate(
    { payment: payment._id, type: 'CAPTURE' },
    {
      payment: payment._id,
      type: 'CAPTURE',
      amount: payment.amount,
      status: 'SUCCESS',
      reference: payment.providerReference,
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Review.findOneAndUpdate(
    { restaurant: restaurant._id, customer: users.nora._id, order: paidOrder._id },
    {
      restaurant: restaurant._id,
      customer: users.nora._id,
      order: paidOrder._id,
      rating: 5,
      comment: 'Fast service and the brunch was excellent.',
      response: 'Thank you for visiting Demo Bistro.',
      isPublished: true,
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Promise.all(
    [
      [users.owner, 'DAILY_SUMMARY', 'Daily summary is ready', 'Revenue and order numbers are available.'],
      [users.chef, 'ORDER_READY', 'Two active kitchen tickets', 'Check the kitchen display for live preparation.'],
      [users.ariana, 'LOYALTY_POINTS', 'You earned loyalty points', 'Your recent order added points to your account.'],
    ].map(([user, type, title, body]) =>
      Notification.findOneAndUpdate(
        { user: user._id, type, title },
        { restaurant: restaurant._id, user: user._id, type, title, body, readAt: null, deletedAt: null },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  logger.info('Seed complete');
  logger.info('Owner login: owner@demo.com / Password123!');
  logger.info('Manager login: manager@demo.com / Password123!');
  logger.info('Chef login: chef@demo.com / Password123!');
  logger.info('Customer login: ariana@example.com / Password123!');
  await disconnectDatabase();
};

seed().catch(async (error) => {
  logger.error('Seed failed', { stack: error.stack });
  await disconnectDatabase();
  process.exit(1);
});
