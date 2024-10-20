// socket.js (or socket.ts for TypeScript)
import { io } from 'socket.io-client';

const socket = io('https://admin-chat.liara.run', {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;
