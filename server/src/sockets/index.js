import { Server } from 'socket.io';
import { config } from '../config/index.js';
import { verifyAccessToken } from '../utils/tokens.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: config.clientUrl, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (token) socket.user = verifyAccessToken(token);
      next();
    } catch {
      next();
    }
  });

  io.on('connection', (socket) => {
    socket.join('staff');
    if (socket.user?.sub) socket.join(`user:${socket.user.sub}`);
  });
};

export const emitToStaff = (event, payload) => {
  if (io) io.to('staff').emit(event, payload);
};

export const emitToUser = (userId, event, payload) => {
  if (io) io.to(`user:${userId}`).emit(event, payload);
};
