import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 8000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_app',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
};

export const restaurantConfig = {
  name: 'Velora Kitchen',
  tagline: 'Wood-fired comfort food, crafted with seasonal ingredients.',
  phone: '+1 555 123 4567',
  email: 'hello@velorakitchen.test',
  currency: 'USD',
  taxRate: 8.5,
  serviceChargeRate: 4,
  deliveryFee: 5,
  address: {
    line1: '14 Market Street',
    city: 'New York',
    state: 'NY',
    country: 'US',
    postalCode: '10001',
  },
  hours: [
    { day: 'Mon-Thu', open: '11:00 AM', close: '10:00 PM' },
    { day: 'Fri-Sat', open: '11:00 AM', close: '11:30 PM' },
    { day: 'Sun', open: '10:00 AM', close: '9:00 PM' },
  ],
};
