export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data, options = {}) {
    return this.model.create([data], options).then(([doc]) => doc);
  }

  findById(id, projection = null) {
    return this.model.findOne({ _id: id, deletedAt: null }, projection);
  }

  findOne(filter, projection = null) {
    return this.model.findOne({ ...filter, deletedAt: null }, projection);
  }

  async findMany({ filter = {}, page = 1, limit = 20, sort = '-createdAt', populate = [] }) {
    const skip = (Number(page) - 1) * Number(limit);
    const query = this.model
      .find({ ...filter, deletedAt: null })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    populate.forEach((path) => query.populate(path));

    const [items, total] = await Promise.all([
      query,
      this.model.countDocuments({ ...filter, deletedAt: null }),
    ]);

    return {
      items,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    };
  }

  updateById(id, data) {
    return this.model.findOneAndUpdate({ _id: id, deletedAt: null }, data, {
      new: true,
      runValidators: true,
    });
  }

  softDeleteById(id) {
    return this.model.findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: new Date() }, { new: true });
  }
}
