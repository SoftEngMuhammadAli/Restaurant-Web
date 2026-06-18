import { TABLE_STATUS } from '../constants/enums.js';
import { ApiError } from '../utils/ApiError.js';
import { Table } from '../models/Table.js';
import { emitRestaurantEvent } from '../sockets/index.js';
import { CrudService } from './CrudService.js';
import { repositories } from '../repositories/domainRepositories.js';

class TableService extends CrudService {
  constructor() {
    super(repositories.tables, { searchableFields: ['number', 'section'] });
  }

  async updateStatus({ user, id, status }) {
    if (!Object.values(TABLE_STATUS).includes(status)) throw new ApiError(422, 'Invalid table status');
    const table = await Table.findOneAndUpdate(
      { _id: id, restaurant: user.restaurant, deletedAt: null },
      { status },
      { new: true, runValidators: true },
    );
    if (!table) throw new ApiError(404, 'Table not found');
    emitRestaurantEvent(user.restaurant, 'tables:update', table);
    return table;
  }
}

export const tableService = new TableService();
