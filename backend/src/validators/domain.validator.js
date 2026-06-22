import Joi from 'joi';
import { objectId } from './common.validator.js';
import { ORDER_STATUS, TABLE_STATUS } from '../constants/enums.js';

export const categorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().min(2).max(120).required(),
    description: Joi.string().allow('', null),
    imageUrl: Joi.string().uri().allow('', null),
    sortOrder: Joi.number().integer().min(0),
    isActive: Joi.boolean(),
  }),
});

export const menuItemSchema = Joi.object({
  body: Joi.object({
    category: objectId.required(),
    name: Joi.string().min(2).max(120).required(),
    slug: Joi.string().min(2).max(140).required(),
    description: Joi.string().allow('', null),
    basePrice: Joi.number().min(0).required(),
    imageUrl: Joi.string().uri().allow('', null),
    variants: Joi.array().items(objectId),
    addons: Joi.array().items(objectId),
    tags: Joi.array().items(Joi.string()),
    prepTimeMinutes: Joi.number().integer().min(0),
    isAvailable: Joi.boolean(),
  }),
});

export const tableSchema = Joi.object({
  body: Joi.object({
    number: Joi.string().required(),
    section: Joi.string().allow('', null),
    seats: Joi.number().integer().min(1).required(),
    status: Joi.string().valid(...Object.values(TABLE_STATUS)),
  }),
});

export const tableStatusSchema = Joi.object({
  body: Joi.object({ status: Joi.string().valid(...Object.values(TABLE_STATUS)).required() }),
  params: Joi.object({ id: objectId.required() }),
});

export const reservationSchema = Joi.object({
  body: Joi.object({
    table: objectId,
    customer: objectId,
    guestName: Joi.string().required(),
    guestPhone: Joi.string().required(),
    guestEmail: Joi.string().email().allow('', null),
    partySize: Joi.number().integer().min(1).required(),
    startsAt: Joi.date().iso().required(),
    endsAt: Joi.date().iso().greater(Joi.ref('startsAt')).required(),
    status: Joi.string().valid('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'),
    notes: Joi.string().allow('', null),
  }),
});

export const orderSchema = Joi.object({
  body: Joi.object({
    type: Joi.string().valid('DINE_IN', 'TAKEAWAY', 'DELIVERY', 'ONLINE').required(),
    table: objectId,
    customer: objectId,
    items: Joi.array()
      .items(
        Joi.object({
          menuItem: objectId.required(),
          quantity: Joi.number().integer().min(1).required(),
          unitPrice: Joi.number().min(0),
          variant: Joi.object(),
          addons: Joi.array().items(Joi.object()),
          notes: Joi.string().allow('', null),
        }),
      )
      .min(1)
      .required(),
    taxTotal: Joi.number().min(0),
    discountTotal: Joi.number().min(0),
    serviceCharge: Joi.number().min(0),
    notes: Joi.string().allow('', null),
  }),
});

export const orderStatusSchema = Joi.object({
  body: Joi.object({ status: Joi.string().valid(...Object.values(ORDER_STATUS)).required() }),
  params: Joi.object({ id: objectId.required() }),
});

export const paymentSchema = Joi.object({
  body: Joi.object({
    order: objectId.required(),
    provider: Joi.string().valid('STRIPE', 'PAYPAL', 'JAZZCASH', 'EASYPAISA', 'CASH').required(),
    amount: Joi.number().min(0),
    currency: Joi.string().length(3),
  }),
});

export const addonSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    price: Joi.number().min(0).required(),
    isActive: Joi.boolean(),
  }),
});

export const variantSchema = Joi.object({
  body: Joi.object({
    menuItem: objectId,
    name: Joi.string().min(2).max(80).required(),
    price: Joi.number().min(0).required(),
    sku: Joi.string().allow('', null),
    isDefault: Joi.boolean(),
  }),
});

export const customerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null),
    password: Joi.string().min(8).default('Password123!'),
    role: objectId,
  }),
});

export const reviewSchema = Joi.object({
  body: Joi.object({
    customer: objectId,
    order: objectId,
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().allow('', null),
    response: Joi.string().allow('', null),
    isPublished: Joi.boolean(),
  }),
});

export const notificationSchema = Joi.object({
  body: Joi.object({
    user: objectId,
    type: Joi.string().required(),
    title: Joi.string().required(),
    body: Joi.string().allow('', null),
    data: Joi.object(),
    readAt: Joi.date().iso().allow(null),
  }),
});

export const restaurantSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(120).required(),
    slug: Joi.string().min(2).max(140).required(),
    owner: objectId,
    logoUrl: Joi.string().uri().allow('', null),
    coverUrl: Joi.string().uri().allow('', null),
    phone: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    currency: Joi.string().length(3),
    timezone: Joi.string(),
    address: Joi.object(),
    settings: Joi.object({
      taxRate: Joi.number().min(0),
      serviceChargeRate: Joi.number().min(0),
      acceptsOnlineOrders: Joi.boolean(),
    }),
  }),
});

export const roleSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .valid('SUPER_ADMIN', 'OWNER', 'MANAGER', 'WAITER', 'CHEF', 'CASHIER', 'CUSTOMER')
      .required(),
    permissions: Joi.array().items(Joi.string()),
    system: Joi.boolean(),
  }),
});

export const userProfileSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    phone: Joi.string().allow('', null),
    preferences: Joi.array().items(Joi.string()),
    notes: Joi.string().allow('', null),
  }),
});

export const addressSchema = Joi.object({
  body: Joi.object({
    label: Joi.string().min(2).max(40).default('Home'),
    line1: Joi.string().min(3).required(),
    line2: Joi.string().allow('', null),
    city: Joi.string().min(2).required(),
    state: Joi.string().allow('', null),
    country: Joi.string().min(2).required(),
    postalCode: Joi.string().allow('', null),
    isDefault: Joi.boolean(),
  }),
});
