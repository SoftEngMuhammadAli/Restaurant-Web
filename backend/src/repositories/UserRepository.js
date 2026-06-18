import { User } from '../models/User.js';
import { BaseRepository } from './BaseRepository.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByEmailWithSecrets(email) {
    return User.findOne({ email, deletedAt: null }).select(
      '+password +refreshTokenHash +emailVerificationToken +passwordResetToken',
    );
  }
}

export const userRepository = new UserRepository();
