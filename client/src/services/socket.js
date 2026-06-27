import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000', {
    auth: { token: localStorage.getItem('accessToken') },
  });
  return socket;
};
