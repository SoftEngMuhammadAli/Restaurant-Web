export const ok = (res, message, data = null, meta = null) =>
  res.json({ success: true, message, data, meta });

export const created = (res, message, data = null) =>
  res.status(201).json({ success: true, message, data, meta: null });
