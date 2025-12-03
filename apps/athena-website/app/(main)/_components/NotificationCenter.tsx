'use client';

import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationCenter() {
  const { notifications, isConnected, error, removeNotification, clearNotifications } =
    useNotifications();

  return (
    <div className="fixed top-4 right-0 md:w-[40dvw] w-[80dvw] max-h-[80vh] overflow-y-auto bg-white shadow-lg rounded-lg border">
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Notifications</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-500">
            ({notifications.length})
          </span>
        </div>
        {notifications.length > 0 && (
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="p-2">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-blue-600 uppercase">
                  {notification.message}
                </span>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
