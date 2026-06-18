import { Role } from '../models/Role.js';
import { BaseRepository } from './BaseRepository.js';

class RoleRepository extends BaseRepository {
  constructor() {
    super(Role);
  }

  findByName(name) {
    return Role.findOne({ name, deletedAt: null });
  }
}

export const roleRepository = new RoleRepository();
