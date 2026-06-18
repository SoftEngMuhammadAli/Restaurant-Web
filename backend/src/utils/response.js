export const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null, meta = null }) =>
  res.status(statusCode).json({ success: true, message, data, meta });

export const sendCreated = (res, data, message = 'Created') =>
  sendSuccess(res, { statusCode: 201, message, data });
