'use client';
import { Notification } from "@athena/types";
type Listener = (notification: Notification) => void;
type ConnectionListener = (isConnected: boolean) => void;
type ErrorListener = (error: string | null) => void;

class NotificationManager {
  private static instance: NotificationManager;
  private eventSource: EventSource | null = null;
  private listeners: Set<Listener> = new Set();
  private connectionListeners: Set<ConnectionListener> = new Set();
  private errorListeners: Set<ErrorListener> = new Set();
  private notifications: Notification[] = [];
  private isConnected: boolean = false;
  private error: string | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private url: string = '';

  private constructor() { }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  connect(url: string) {
    // Only create connection if not already connected to this URL
    if (this.eventSource && this.url === url) {
      return;
    }

    this.url = url;
    this.disconnect();

    console.log('Creating SSE connection to:', url);
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('SSE connection established');
      this.isConnected = true;
      this.error = null;
      this.notifyConnectionListeners(true);
      this.notifyErrorListeners(null);
    };

    this.eventSource.onmessage = (event) => {
      console.log("Notification", JSON.parse(event.data)?.data)
      try {
        const notification = JSON.parse(event.data);
        this.addNotification(notification.data);
      } catch (err) {
        console.error('Failed to parse notification:', err);
      }
    };

    this.eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      this.isConnected = false;
      this.error = 'Connection error. Retrying...';
      this.notifyConnectionListeners(false);
      this.notifyErrorListeners(this.error);

      // Auto-reconnect after 3 seconds
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      this.reconnectTimeout = setTimeout(() => {
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.connect(this.url);
        }
      }, 3000);
    };

    // Listen for specific event types
    this.eventSource.addEventListener('user_registered', (event: MessageEvent) => {
      console.log('User registered event:', event.data);
    });

    this.eventSource.addEventListener('order_created', (event: MessageEvent) => {
      console.log('Order created event:', event.data);
    });
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    }
  }

  private addNotification(notification: Notification) {
    this.notifications = [notification, ...this.notifications].slice(0, 50); // Keep last 50
    this.notifyListeners(notification);
  }

  private notifyListeners(notification: Notification) {
    this.listeners.forEach((listener) => listener(notification));
  }

  private notifyConnectionListeners(isConnected: boolean) {
    this.connectionListeners.forEach((listener) => listener(isConnected));
  }

  private notifyErrorListeners(error: string | null) {
    this.errorListeners.forEach((listener) => listener(error));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeToConnection(listener: ConnectionListener): () => void {
    this.connectionListeners.add(listener);
    // Immediately notify of current state
    listener(this.isConnected);
    return () => this.connectionListeners.delete(listener);
  }

  subscribeToError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    // Immediately notify of current state
    listener(this.error);
    return () => this.errorListeners.delete(listener);
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  clearNotifications() {
    this.notifications = [];
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  getConnectionState() {
    return {
      isConnected: this.isConnected,
      error: this.error,
    };
  }

  // Get number of active subscribers
  getSubscriberCount() {
    return this.listeners.size;
  }
}

export default NotificationManager;
