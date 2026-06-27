import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { ORDER_STATUS, ROLES, TABLE_STATUS } from '../constants/enums.js';
import { Address } from '../models/Address.js';
import { Category } from '../models/Category.js';
import { MenuItem } from '../models/MenuItem.js';
import { Notification } from '../models/Notification.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Promotion } from '../models/Promotion.js';
import { Reservation } from '../models/Reservation.js';
import { Restaurant } from '../models/Restaurant.js';
import { Review } from '../models/Review.js';
import { Table } from '../models/Table.js';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';

const password = 'Password123!';

const upsertUser = async ({ email, name, phone, role }) => {
  let user = await User.findOne({ email }).select('+password');
  if (!user) user = new User({ email, name, phone, role, password });

  user.name = name;
  user.phone = phone;
  user.role = role;
  user.password = password;
  user.isActive = true;
  user.deletedAt = null;
  await user.save();
  return user;
};

const upsertCategory = ([name, slug, description, sortOrder, imageUrl]) =>
  Category.findOneAndUpdate(
    { slug },
    { name, slug, description, sortOrder, imageUrl, isActive: true, deletedAt: null },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

const upsertRestaurant = (payload) =>
  Restaurant.findOneAndUpdate(
    { slug: payload.slug },
    { ...payload, deletedAt: null },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

const upsertMenuItem = (payload) =>
  MenuItem.findOneAndUpdate(
    { restaurant: payload.restaurant, slug: payload.slug },
    { ...payload, deletedAt: null },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

const seed = async () => {
  await connectDatabase();

  const users = {
    admin: await upsertUser({ email: 'admin@restaurant.com', name: 'Ava Admin', phone: '+923001110001', role: ROLES.ADMIN }),
    manager: await upsertUser({ email: 'manager@restaurant.com', name: 'Maya Manager', phone: '+923001110002', role: ROLES.MANAGER }),
    chef: await upsertUser({ email: 'chef@restaurant.com', name: 'Chris Chef', phone: '+923001110003', role: ROLES.CHEF }),
    waiter: await upsertUser({ email: 'waiter@restaurant.com', name: 'Wade Waiter', phone: '+923001110004', role: ROLES.WAITER }),
    cashier: await upsertUser({ email: 'cashier@restaurant.com', name: 'Cara Cashier', phone: '+923001110005', role: ROLES.CASHIER }),
    customer: await upsertUser({ email: 'customer@example.com', name: 'Ariana Khan', phone: '+923001110031', role: ROLES.CUSTOMER }),
  };

  const categoryRows = [
    ['Burgers', 'burgers', 'Smash burgers, grilled chicken, and loaded sandwiches.', 1, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80'],
    ['Pizza', 'pizza', 'Stone-baked pizzas with classic and local toppings.', 2, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80'],
    ['Biryani', 'biryani', 'Aromatic rice, slow-cooked meats, and family deals.', 3, 'https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=900&q=80'],
    ['Asian', 'asian', 'Noodles, sushi, bowls, and wok-fired favorites.', 4, 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=80'],
    ['Desserts', 'desserts', 'Cakes, brownies, ice cream, and sweet cravings.', 5, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80'],
    ['Drinks', 'drinks', 'Coffee, juices, mocktails, and soft drinks.', 6, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80'],
  ];

  const categories = {};
  for (const row of categoryRows) {
    categories[row[1]] = await upsertCategory(row);
  }

  const restaurants = {
    burgerYard: await upsertRestaurant({
      name: 'Burger Yard',
      slug: 'burger-yard',
      cuisine: 'Burgers',
      description: 'Juicy smash burgers, crispy sides, and late-night comfort food.',
      logoUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1600&q=85',
      rating: 4.7,
      reviewCount: 1284,
      deliveryTime: '20-30 min',
      deliveryFee: 129,
      minimumOrder: 599,
      distanceKm: 1.8,
      isFeatured: true,
      tags: ['Free drink', 'Smash burgers', 'Late night'],
      address: { line1: 'MM Alam Road', area: 'Gulberg', city: 'Lahore', country: 'Pakistan' },
      phone: '+924211100001',
    }),
    karachiSpice: await upsertRestaurant({
      name: 'Karachi Spice House',
      slug: 'karachi-spice-house',
      cuisine: 'Pakistani',
      description: 'Biryani, karahi, rolls, and proper desi sharing meals.',
      logoUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1600&q=85',
      rating: 4.8,
      reviewCount: 2139,
      deliveryTime: '30-45 min',
      deliveryFee: 99,
      minimumOrder: 699,
      distanceKm: 2.4,
      isFeatured: true,
      tags: ['Family deals', 'Biryani', 'Karahi'],
      address: { line1: 'Tipu Sultan Road', area: 'PECHS', city: 'Karachi', country: 'Pakistan' },
      phone: '+922111100002',
    }),
    sushiMori: await upsertRestaurant({
      name: 'Sushi Mori',
      slug: 'sushi-mori',
      cuisine: 'Japanese',
      description: 'Fresh sushi, ramen bowls, katsu, and clean Japanese flavors.',
      logoUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1600&q=85',
      rating: 4.6,
      reviewCount: 844,
      deliveryTime: '35-50 min',
      deliveryFee: 179,
      minimumOrder: 999,
      distanceKm: 4.1,
      isFeatured: false,
      tags: ['Sushi', 'Ramen', 'Premium'],
      address: { line1: 'Bahria Food Street', area: 'Bahria Town', city: 'Rawalpindi', country: 'Pakistan' },
      phone: '+925111100003',
    }),
    ovenStory: await upsertRestaurant({
      name: 'Oven Story Pizza',
      slug: 'oven-story-pizza',
      cuisine: 'Pizza',
      description: 'Hand-stretched pizzas, cheesy crusts, wings, and party boxes.',
      logoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1601924582975-7f36444f7b04?auto=format&fit=crop&w=1600&q=85',
      rating: 4.5,
      reviewCount: 982,
      deliveryTime: '25-40 min',
      deliveryFee: 149,
      minimumOrder: 799,
      distanceKm: 3.2,
      isFeatured: true,
      tags: ['Buy 1 get 1', 'Pizza', 'Party box'],
      address: { line1: 'F-7 Markaz', area: 'F-7', city: 'Islamabad', country: 'Pakistan' },
      phone: '+925111100004',
    }),
  };

  const itemRows = [
    [restaurants.burgerYard, categories.burgers, 'Classic Smash Burger', 'burger-yard-classic-smash-burger', 749, 'Double smashed beef, cheddar, pickles, caramelized onions, and yard sauce.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', ['Popular', 'Beef'], true],
    [restaurants.burgerYard, categories.burgers, 'Crispy Chicken Stack', 'burger-yard-crispy-chicken-stack', 699, 'Buttermilk fried chicken, lettuce, garlic mayo, and soft brioche.', 'https://images.unsplash.com/photo-1606755962773-d324e9a13086?auto=format&fit=crop&w=900&q=80', ['Crispy'], true],
    [restaurants.burgerYard, categories.drinks, 'Mint Lemon Cooler', 'burger-yard-mint-lemon-cooler', 249, 'Fresh mint, lemon, soda, and crushed ice.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80', ['Chilled'], false],
    [restaurants.karachiSpice, categories.biryani, 'Chicken Biryani Box', 'karachi-spice-chicken-biryani-box', 549, 'Aromatic basmati rice, spicy chicken, raita, salad, and chutney.', 'https://images.unsplash.com/photo-1563379091339-03246963d51a?auto=format&fit=crop&w=900&q=80', ['Best seller', 'Spicy'], true],
    [restaurants.karachiSpice, categories.biryani, 'Mutton Karahi Half', 'karachi-spice-mutton-karahi-half', 1899, 'Wok-cooked mutton, tomatoes, green chilies, ginger, and fresh naan.', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80', ['Family'], true],
    [restaurants.karachiSpice, categories.drinks, 'Sweet Lassi', 'karachi-spice-sweet-lassi', 229, 'Thick yogurt lassi served cold.', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80', ['Traditional'], false],
    [restaurants.sushiMori, categories.asian, 'Salmon Crunch Roll', 'sushi-mori-salmon-crunch-roll', 1299, 'Salmon, cucumber, spicy mayo, tempura flakes, and sesame.', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=80', ['Premium'], true],
    [restaurants.sushiMori, categories.asian, 'Chicken Katsu Curry', 'sushi-mori-chicken-katsu-curry', 1199, 'Crispy chicken cutlet, Japanese curry, steamed rice, and pickles.', 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=900&q=80', ['Comfort'], false],
    [restaurants.ovenStory, categories.pizza, 'Tandoori Chicken Pizza', 'oven-story-tandoori-chicken-pizza', 1399, 'Tandoori chicken, peppers, onions, mozzarella, and smoky sauce.', 'https://images.unsplash.com/photo-1601924582975-7f36444f7b04?auto=format&fit=crop&w=900&q=80', ['Deal'], true],
    [restaurants.ovenStory, categories.pizza, 'Margherita Cheese Burst', 'oven-story-margherita-cheese-burst', 999, 'Tomato sauce, mozzarella, basil, and cheese-filled crust.', 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?auto=format&fit=crop&w=900&q=80', ['Vegetarian'], false],
    [restaurants.ovenStory, categories.desserts, 'Chocolate Lava Cake', 'oven-story-chocolate-lava-cake', 399, 'Warm chocolate cake with a molten center.', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=900&q=80', ['Dessert'], false],
  ];

  const items = {};
  for (const [restaurant, category, name, slug, price, description, imageUrl, labels, isFeatured] of itemRows) {
    items[slug] = await upsertMenuItem({
      restaurant: restaurant._id,
      category: category._id,
      name,
      slug,
      price,
      description,
      imageUrl,
      labels,
      isFeatured,
      isAvailable: true,
      variants: [{ name: 'Regular', price: 0 }, { name: 'Large', price: Math.round(price * 0.35) }],
      addons: [{ name: 'Extra sauce', price: 99 }, { name: 'Cheese upgrade', price: 149 }],
    });
  }

  await Promotion.findOneAndUpdate(
    { title: 'Weekend Feast Deals' },
    {
      title: 'Weekend Feast Deals',
      subtitle: 'Save up to 35% on burgers, biryani, and pizza boxes near you.',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=85',
      ctaLabel: 'Explore deals',
      ctaUrl: '/restaurants',
      placement: 'HERO',
      sortOrder: 1,
      isActive: true,
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  for (const [title, subtitle, restaurant, imageUrl, sortOrder] of [
    ['Free delivery today', 'On selected featured restaurants.', restaurants.burgerYard, 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=1200&q=85', 2],
    ['Family biryani night', 'Large sharing boxes from Karachi Spice House.', restaurants.karachiSpice, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=85', 3],
    ['Pizza party combo', 'Hot pizzas, wings, and lava cakes.', restaurants.ovenStory, 'https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=1200&q=85', 4],
  ]) {
    await Promotion.findOneAndUpdate(
      { title },
      { title, subtitle, restaurant: restaurant._id, imageUrl, ctaLabel: 'Order now', ctaUrl: `/restaurants/${restaurant.slug}`, placement: 'HOME_BANNER', sortOrder, isActive: true, deletedAt: null },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const tables = [];
  for (let index = 1; index <= 8; index += 1) {
    tables.push(await Table.findOneAndUpdate(
      { number: `BY-${index}` },
      {
        restaurant: restaurants.burgerYard._id,
        number: `BY-${index}`,
        section: index <= 4 ? 'Main Floor' : 'Terrace',
        seats: index % 4 === 0 ? 6 : 4,
        status: [TABLE_STATUS.AVAILABLE, TABLE_STATUS.OCCUPIED, TABLE_STATUS.RESERVED, TABLE_STATUS.AVAILABLE][index % 4],
        deletedAt: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ));
  }

  await Address.findOneAndUpdate(
    { user: users.customer._id, label: 'Home' },
    { user: users.customer._id, label: 'Home', line1: '82 Model Town Link Road', city: 'Lahore', state: 'Punjab', country: 'Pakistan', postalCode: '54000', isDefault: true, deletedAt: null },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Reservation.findOneAndUpdate(
    { email: users.customer.email },
    {
      restaurant: restaurants.burgerYard._id,
      customer: users.customer._id,
      table: tables[3]._id,
      name: users.customer.name,
      phone: users.customer.phone,
      email: users.customer.email,
      partySize: 4,
      date: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'CONFIRMED',
      notes: 'Prefers a quiet corner.',
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const orderItems = [
    { menuItem: items['burger-yard-classic-smash-burger']._id, name: items['burger-yard-classic-smash-burger'].name, quantity: 2, unitPrice: 749 },
    { menuItem: items['burger-yard-mint-lemon-cooler']._id, name: items['burger-yard-mint-lemon-cooler'].name, quantity: 2, unitPrice: 249 },
  ];
  const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = Number((subtotal * 0.085).toFixed(2));
  const total = Number((subtotal + tax + restaurants.burgerYard.deliveryFee).toFixed(2));
  const order = await Order.findOneAndUpdate(
    { orderNumber: 'FD-DEMO-1001' },
    {
      orderNumber: 'FD-DEMO-1001',
      restaurant: restaurants.burgerYard._id,
      customer: users.customer._id,
      customerInfo: { name: users.customer.name, phone: users.customer.phone, email: users.customer.email, address: '82 Model Town Link Road, Lahore' },
      type: 'DELIVERY',
      items: orderItems,
      status: ORDER_STATUS.PREPARING,
      subtotal,
      tax,
      deliveryFee: restaurants.burgerYard.deliveryFee,
      total,
      paymentMethod: 'CASH',
      paymentStatus: 'UNPAID',
      deletedAt: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Payment.findOneAndUpdate(
    { order: order._id },
    { order: order._id, restaurant: restaurants.burgerYard._id, method: 'CASH', amount: total, status: 'PENDING', reference: 'seed-payment', deletedAt: null },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  for (const [restaurant, name, rating, comment] of [
    [restaurants.burgerYard, 'Nora Patel', 5, 'The burger was hot, packed well, and arrived faster than expected.'],
    [restaurants.karachiSpice, 'Hamza Ali', 5, 'Biryani was properly spicy and the family deal was generous.'],
    [restaurants.ovenStory, 'Sara Sheikh', 4, 'Great cheese burst pizza and the deal made sense for a group.'],
  ]) {
    await Review.findOneAndUpdate(
      { restaurant: restaurant._id, name },
      { restaurant: restaurant._id, name, rating, comment, isPublished: true, deletedAt: null },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  await Notification.findOneAndUpdate(
    { title: 'New marketplace order' },
    { audience: 'STAFF', type: 'ORDER', title: 'New marketplace order', message: 'Burger Yard has an active delivery order.', deletedAt: null },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  logger.info('Marketplace seed complete');
  logger.info('Admin: admin@restaurant.com / Password123!');
  logger.info('Customer: customer@example.com / Password123!');
  await disconnectDatabase();
};

seed().catch(async (error) => {
  logger.error('Seed failed', { stack: error.stack });
  await disconnectDatabase();
  process.exit(1);
});
