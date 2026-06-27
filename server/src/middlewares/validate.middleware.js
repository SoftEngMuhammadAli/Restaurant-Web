import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, _res, next) => {
  const { value, error } = schema.validate(
    { body: req.body, params: req.params, query: req.query },
    { abortEarly: false, stripUnknown: true },
  );

  if (error) {
    return next(new ApiError(422, 'Validation failed', error.details.map((item) => item.message)));
  }

  req.body = value.body || req.body;
  req.params = value.params || req.params;
  req.query = value.query || req.query;
  return next();
};
