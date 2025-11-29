
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Subject } from 'rxjs';
import { OnEvent } from '@nestjs/event-emitter';
import { NOTIFICATION_QUEUE, NotificationEvent, NotificationJob } from './types/notification.constants';
import { NotificationEventPayload } from './types/notification.types';
import { NotificationCategory } from '@athena/types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE)
    private queue: Queue<NotificationEventPayload, any, NotificationJob>,
  ) { }

  private streams = new Map<string, Subject<any>>();

  getStream(userId: string): Subject<any> | undefined {
    if (!this.streams.has(userId)) {
      this.streams.set(userId, new Subject());
    }
    return this.streams.get(userId);
  }

  async enqueue(userId: string, category: NotificationCategory, message: string, meta?: Record<string, any>) {
    await this.queue.add(NotificationJob.CREATE, { userId, category, message, meta });
  }


  @OnEvent(NotificationEvent.FIRE)
  async onNotify(event: NotificationEventPayload) {
    await this.enqueue(event.userId, event.category, event.message, event.meta);
  }

  pushToClient(userId: string, notification: any) {
    this.streams.get(userId)?.next(notification)
  }
}
