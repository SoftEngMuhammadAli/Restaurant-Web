import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/response.js';

export class CrudController {
  constructor(service, label = 'Resource') {
    this.service = service;
    this.label = label;
  }

  list = asyncHandler(async (req, res) => {
    const result = await this.service.list({ user: req.user, query: req.query });
    sendSuccess(res, { message: `${this.label} list`, data: result.items, meta: result.meta });
  });

  get = asyncHandler(async (req, res) => {
    const data = await this.service.get({ user: req.user, id: req.params.id });
    sendSuccess(res, { message: `${this.label} detail`, data });
  });

  create = asyncHandler(async (req, res) => {
    const data = await this.service.create({ user: req.user, payload: req.body });
    sendCreated(res, data, `${this.label} created`);
  });

  update = asyncHandler(async (req, res) => {
    const data = await this.service.update({ user: req.user, id: req.params.id, payload: req.body });
    sendSuccess(res, { message: `${this.label} updated`, data });
  });

  remove = asyncHandler(async (req, res) => {
    await this.service.remove({ user: req.user, id: req.params.id });
    sendSuccess(res, { message: `${this.label} deleted` });
  });
}
