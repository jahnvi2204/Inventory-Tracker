// src/socket.js - Updated to use stable socket
import stableSocket from './socket/index';

// Re-export the stable socket instance
export default stableSocket;

// Optional: Add convenience methods if needed
export const connectSocket = (url) => {
  return stableSocket.connect(url);
};

export const disconnectSocket = () => {
  stableSocket.disconnect();
};

export const emitEvent = (event, data) => {
  stableSocket.emit(event, data);
};

export const onEvent = (event, callback) => {
  stableSocket.on(event, callback);
};

export const offEvent = (event, callback) => {
  stableSocket.off(event, callback);
};

export const isSocketConnected = () => {
  return stableSocket.connected;
};