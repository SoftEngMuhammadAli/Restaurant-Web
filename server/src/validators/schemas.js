import Joi from 'joi';
import { ORDER_STATUS, ORDER_TYPES, TABLE_STATUS } from '../constants/enums.js';

const id = Joi.string().hex().length(24);

export const idParam = Joi.object({
  params: Joi.object({ id: id.required() }),
});

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null),
    password: Joi.string().min(8).max(128).required(),
  }),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

export const categorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).required(),
    slug: Joi.string().min(2).required(),
    description: Joi.string().allow('', null),
    imageUrl: Joi.string().uri().allow('', null),
    sortOrder: Joi.number().integer().min(0),
    isActive: Joi.boolean(),
  }),
});

export const menuItemSchema = Joi.object({
  body: Joi.object({
    restaurant: id.required(),
    category: id.required(),
    name: Joi.string().min(2).required(),
    slug: Joi.string().min(2).required(),
    description: Joi.string().min(5).required(),
    price: Joi.number().min(0).required(),
    imageUrl: Joi.string().uri().required(),
    labels: Joi.array().items(Joi.string()),
    spiceLevel: Joi.number().integer().min(0).max(3),
    prepTimeMinutes: Joi.number().integer().min(0),
    variants: Joi.array().items(Joi.object({ name: Joi.string().required(), price: Joi.number().min(0).required() })),
    addons: Joi.array().items(Joi.object({ name: Joi.string().required(), price: Joi.number().min(0).required() })),
    isFeatured: Joi.boolean(),
    isAvailable: Joi.boolean(),
  }),
});

export const orderSchema = Joi.object({
  body: Joi.object({
    restaurant: id.required(),
    type: Joi.string().valid(...Object.values(ORDER_TYPES)).required(),
    table: id,
    customer: id,
    customerInfo: Joi.object({
      name: Joi.string().allow('', null),
      phone: Joi.string().allow('', null),
      email: Joi.string().email().allow('', null),
      address: Joi.string().allow('', null),
    }),
    items: Joi.array().items(Joi.object({
      menuItem: id.required(),
      quantity: Joi.number().integer().min(1).required(),
      variant: Joi.object({ name: Joi.string(), price: Joi.number().min(0) }),
      addons: Joi.array().items(Joi.object({ name: Joi.string(), price: Joi.number().min(0) })),
      notes: Joi.string().allow('', null),
    })).min(1).required(),
    paymentMethod: Joi.string().valid('CASH', 'CARD', 'JAZZCASH', 'EASYPAISA'),
    discount: Joi.number().min(0),
    notes: Joi.string().allow('', null),
  }),
});

export const orderStatusSchema = Joi.object({
  params: Joi.object({ id: id.required() }),
  body: Joi.object({ status: Joi.string().valid(...Object.values(ORDER_STATUS)).required() }),
});

export const paymentSchema = Joi.object({
  params: Joi.object({ id: id.required() }),
  body: Joi.object({
    method: Joi.string().valid('CASH', 'CARD', 'JAZZCASH', 'EASYPAISA').required(),
    reference: Joi.string().allow('', null),
  }),
});

export const reservationSchema = Joi.object({
  body: Joi.object({
    restaurant: id,
    table: id,
    name: Joi.string().min(2).required(),
    phone: Joi.string().min(6).required(),
    email: Joi.string().email().allow('', null),
    partySize: Joi.number().integer().min(1).required(),
    date: Joi.date().iso().required(),
    notes: Joi.string().allow('', null),
  }),
});

export const tableStatusSchema = Joi.object({
  params: Joi.object({ id: id.required() }),
  body: Joi.object({ status: Joi.string().valid(...Object.values(TABLE_STATUS)).required() }),
});

export const addressSchema = Joi.object({
  body: Joi.object({
    label: Joi.string().default('Home'),
    line1: Joi.string().min(3).required(),
    line2: Joi.string().allow('', null),
    city: Joi.string().min(2).required(),
    state: Joi.string().allow('', null),
    country: Joi.string().min(2).required(),
    postalCode: Joi.string().allow('', null),
    isDefault: Joi.boolean(),
  }),
});
