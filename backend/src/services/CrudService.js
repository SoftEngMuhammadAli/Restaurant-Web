import { ApiError } from '../utils/ApiError.js';

export class CrudService {
  constructor(repository, { scopeByRestaurant = true, searchableFields = [] } = {}) {
    this.repository = repository;
    this.scopeByRestaurant = scopeByRestaurant;
    this.searchableFields = searchableFields;
  }

  scopedFilter(user, filter = {}) {
    const nextFilter = { ...filter };
    if (this.scopeByRestaurant && user?.restaurant) nextFilter.restaurant = user.restaurant;
    return nextFilter;
  }

  async list({ user, query }) {
    const filter = this.scopedFilter(user);

    if (query.search && this.searchableFields.length) {
      filter.$or = this.searchableFields.map((field) => ({
        [field]: { $regex: query.search, $options: 'i' },
      }));
    }

    return this.repository.findMany({
      filter,
      page: query.page || 1,
      limit: query.limit || 20,
      sort: query.sort || '-createdAt',
    });
  }

  async get({ user, id }) {
    const record = await this.repository.findOne(this.scopedFilter(user, { _id: id }));
    if (!record) throw new ApiError(404, 'Resource not found');
    return record;
  }

  create({ user, payload }) {
    return this.repository.create(this.scopedFilter(user, payload));
  }

  async update({ user, id, payload }) {
    await this.get({ user, id });
    return this.repository.updateById(id, payload);
  }

  async remove({ user, id }) {
    await this.get({ user, id });
    return this.repository.softDeleteById(id);
  }
}
