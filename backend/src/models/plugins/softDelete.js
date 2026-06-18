export const softDeletePlugin = (schema) => {
  schema.add({
    deletedAt: { type: Date, default: null, index: true },
  });

  schema.methods.softDelete = function softDelete() {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.query.notDeleted = function notDeleted() {
    return this.where({ deletedAt: null });
  };
};
