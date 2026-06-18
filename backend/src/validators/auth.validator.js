import Joi from 'joi';

const password = Joi.string().min(8).max(128).required();

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null),
    password,
    restaurantName: Joi.string().min(2).max(120),
    role: Joi.string().valid('OWNER', 'CUSTOMER'),
  }),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password,
  }),
});

export const tokenSchema = Joi.object({
  body: Joi.object({
    token: Joi.string().required(),
  }),
});

export const forgotPasswordSchema = Joi.object({
  body: Joi.object({ email: Joi.string().email().required() }),
});

export const resetPasswordSchema = Joi.object({
  body: Joi.object({
    token: Joi.string().required(),
    password,
  }),
});

export const changePasswordSchema = Joi.object({
  body: Joi.object({
    currentPassword: password,
    newPassword: password,
  }),
});
