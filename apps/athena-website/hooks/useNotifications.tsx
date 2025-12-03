'use client';

import { useEffect, useState, useCallback } from 'react';
import { Notification } from '@athena/types';
import NotificationManager from '@/lib/notification-manager';



export function useNotifications(url: string = process.env.NEXT_PUBLIC_API_URL + 'notifications/stream') {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const manager = NotificationManager.getInstance();

    // Connect (will reuse existing connection if available)
    manager.connect(url);

    // Get initial notifications
    setNotifications(manager.getNotifications());
    const state = manager.getConnectionState();
    setIsConnected(state.isConnected);
    setError(state.error);

    // Subscribe to new notifications
    const unsubscribe = manager.subscribe((notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
    });

    // Subscribe to connection state
    const unsubscribeConnection = manager.subscribeToConnection((connected) => {
      setIsConnected(connected);
    });

    // Subscribe to errors
    const unsubscribeError = manager.subscribeToError((err) => {
      setError(err);
    });

    return () => {
      unsubscribe();
      unsubscribeConnection();
      unsubscribeError();

      // Only disconnect if no more subscribers
      // This allows other components to keep using the connection
      setTimeout(() => {
        if (manager.getSubscriberCount() === 0) {
          console.log('No more subscribers, disconnecting...');
          manager.disconnect();
        }
      }, 100);
    };
  }, [url]);

  const clearNotifications = useCallback(() => {
    NotificationManager.getInstance().clearNotifications();
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    NotificationManager.getInstance().removeNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const reconnect = useCallback(() => {
    NotificationManager.getInstance().connect(url);
  }, [url]);

  return {
    notifications,
    isConnected,
    error,
    clearNotifications,
    removeNotification,
    reconnect,
  };
}

