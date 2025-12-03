
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Observable, Subject } from 'rxjs';
import { NOTIFICATION_QUEUE, NotificationEvent, NotificationJob } from './types/notification.constants';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEventPayload } from './types/notification.types';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService implements OnModuleInit {

  private notifications$ = new Subject<Notification>();

  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private notificationQueue: Queue,
    @InjectRepository(Notification) private notificationRepo: Repository<Notification>
  ) { }

  async onModuleInit() {
    console.log('NotificationsService initialized');
  }

  // Add notification to queue
  async queueNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'user'>) {
    const fullNotification: Notification = await this.notificationRepo.save({
      ...notification,
    });

    await this.notificationQueue.add(NotificationJob.CREATE, fullNotification, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });

    return fullNotification;
  }

  sendNotification(notification: Notification) {
    this.notifications$.next(notification);
  }

  // Get notification stream for SSE
  getNotifications(userId?: string): Observable<Notification> {
    return new Observable((observer) => {
      const subscription = this.notifications$.subscribe({
        next: (notification) => {
          // Filter by userId if provided
          if (!userId || !notification.userId || notification.userId === userId) {
            observer.next(notification);
          }
        },
        error: (err) => observer.error(err),
      });

      return () => subscription.unsubscribe();
    });
  }


  @OnEvent(NotificationEvent.FIRE)
  async listen(event: NotificationEventPayload) {
    await this.queueNotification({ category: event.category, message: event.message, userId: event.userId })

  }
}
