import { Server } from 'socket.io';
import { config } from '../config/index.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { logger } from '../utils/logger.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      socket.user = verifyAccessToken(token);
      return next();
    } catch {
      return next(new Error('Invalid socket token'));
    }
  });

  io.on('connection', (socket) => {
    const restaurantId = socket.user.restaurant;
    if (restaurantId) socket.join(`restaurant:${restaurantId}`);
    socket.join(`user:${socket.user.sub}`);

    socket.on('restaurant:join', (id) => {
      if (id === restaurantId) socket.join(`restaurant:${id}`);
    });

    socket.on('disconnect', () => {
      logger.debug('Socket disconnected', { socketId: socket.id });
    });
  });

  return io;
};

export const emitRestaurantEvent = (restaurantId, event, payload) => {
  if (!io || !restaurantId) return;
  io.to(`restaurant:${restaurantId}`).emit(event, payload);
};

export const emitUserNotification = (userId, payload) => {
  if (!io || !userId) return;
  io.to(`user:${userId}`).emit('notifications:new', payload);
};
