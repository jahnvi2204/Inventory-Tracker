// src/socket/index.js - Improved socket management
import { io } from 'socket.io-client';

class StableSocket {
  constructor() {
    this.socket = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3; // Reduced attempts
    this.reconnectDelay = 2000; // Increased delay
    this.listeners = new Map();
    this.connectionTimeout = null;
  }

  connect(url) {
    if (this.socket?.connected || this.isConnecting) {
      console.log('🔌 Socket already connected or connecting');
      return this.socket;
    }

    this.isConnecting = true;
    console.log('🔌 Creating new socket connection...');

    const socketUrl = url || process.env.REACT_APP_SOCKET_URL || window.location.origin;
    
    // Clear any existing timeout
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    
    this.socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 8000, // Reduced timeout
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      autoConnect: false, // We'll connect manually
      forceNew: true // Force new connection
    });

    this.setupEventListeners();
    
    // Set connection timeout
    this.connectionTimeout = setTimeout(() => {
      if (this.isConnecting) {
        console.warn('🔌 Socket connection timeout, giving up');
        this.isConnecting = false;
        if (this.socket) {
          this.socket.disconnect();
        }
      }
    }, 10000); // 10 second overall timeout
    
    // Connect manually to have better control
    try {
      this.socket.connect();
    } catch (error) {
      console.error('🔌 Socket connection error:', error);
      this.isConnecting = false;
    }
    
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnecting = false;
      
      // Don't auto-reconnect if disconnected intentionally
      if (reason === 'io client disconnect') {
        console.log('Socket disconnected intentionally');
        return;
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error.message);
      this.isConnecting = false;
      this.reconnectAttempts++;
      
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max socket reconnection attempts reached, giving up');
        this.socket?.disconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed completely');
      this.isConnecting = false;
    });
  }

  disconnect() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    if (this.socket?.connected) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: socket not connected`);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
        // Remove from our tracking
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
          const index = eventListeners.indexOf(callback);
          if (index > -1) {
            eventListeners.splice(index, 1);
          }
        }
      } else {
        this.socket.off(event);
        this.listeners.delete(event);
      }
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
    this.listeners.clear();
  }

  get connected() {
    return this.socket?.connected || false;
  }

  get id() {
    return this.socket?.id || null;
  }

  // Cleanup method
  destroy() {
    console.log('🧹 Destroying socket instance...');
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    this.removeAllListeners();
    this.disconnect();
    this.socket = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }
}

// Create singleton instance
const stableSocket = new StableSocket();

// Export both the instance and the class
export default stableSocket;
export { StableSocket };