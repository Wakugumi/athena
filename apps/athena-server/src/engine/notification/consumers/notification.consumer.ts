import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationService } from '../notification.service';
import { Logger } from '@nestjs/common';
import { Notification } from '../notification.entity';
import { NOTIFICATION_QUEUE } from '../types/notification.constants';

@Processor(NOTIFICATION_QUEUE, {
  concurrency: 10, // Process 10 jobs concurrently
})
export class NotificationConsumer extends WorkerHost {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(private readonly notificationsService: NotificationService) {
    super();
  }

  async process(job: Job<Notification>): Promise<void> {
    this.logger.log(`Processing notification job ${job.id}: ${job.data.id}`);

    try {
      this.notificationsService.sendNotification(job.data);

      // - Store in database
      // - Send email/SMS
      // - Push to mobile devices
      // - Log analytics

      this.logger.log(`Notification ${job.id} sent successfully`);
    } catch (error) {
      this.logger.error(`Failed to process notification ${job.id}:`, error);
      throw error; // Will trigger retry
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed:`, error.message);
  }
}
