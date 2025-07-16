import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
  withCredentials: true,
  autoConnect: false, // Only connect when needed
});

export default socket; 