import { tableService } from '../services/TableService.js';
import { CrudController } from './CrudController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

const crud = new CrudController(tableService, 'Table');

export const tableController = {
  list: crud.list,
  get: crud.get,
  create: crud.create,
  update: crud.update,
  remove: crud.remove,
  updateStatus: asyncHandler(async (req, res) => {
    const table = await tableService.updateStatus({ user: req.user, id: req.params.id, status: req.body.status });
    sendSuccess(res, { message: 'Table status updated', data: table });
  }),
};
