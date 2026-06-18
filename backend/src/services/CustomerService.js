import { ROLES } from '../constants/enums.js';
import { repositories } from '../repositories/domainRepositories.js';
import { roleRepository } from '../repositories/RoleRepository.js';
import { ApiError } from '../utils/ApiError.js';
import { CrudService } from './CrudService.js';

class CustomerService extends CrudService {
  constructor() {
    super(repositories.users, { scopeByRestaurant: true, searchableFields: ['name', 'email', 'phone'] });
  }

  async create({ user, payload }) {
    const role = payload.role ? null : await roleRepository.findByName(ROLES.CUSTOMER);
    const roleId = payload.role || role?._id;
    if (!roleId) throw new ApiError(500, 'Customer role is missing. Run seeders first.');

    return this.repository.create({
      ...payload,
      role: roleId,
      restaurant: user.restaurant,
      isEmailVerified: true,
    });
  }
}

export const customerService = new CustomerService();
