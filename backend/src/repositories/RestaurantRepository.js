import { Restaurant } from '../models/Restaurant.js';
import { BaseRepository } from './BaseRepository.js';

export const restaurantRepository = new BaseRepository(Restaurant);
