import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  socket = null;
};
