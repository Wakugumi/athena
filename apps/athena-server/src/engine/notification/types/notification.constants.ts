export const NOTIFICATION_QUEUE = 'notification';

export enum NotificationJob {
  CREATE = 'create',
}

export const NotificationEvent = {
  FIRE: 'notification.fire',
} as const;

