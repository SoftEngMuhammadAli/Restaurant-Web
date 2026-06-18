import Joi from 'joi';

export const objectId = Joi.string().hex().length(24);

export const idParamSchema = Joi.object({
  params: Joi.object({ id: objectId.required() }),
});

export const listQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().allow('', null),
    sort: Joi.string().allow('', null),
    status: Joi.string().allow('', null),
  }),
});
