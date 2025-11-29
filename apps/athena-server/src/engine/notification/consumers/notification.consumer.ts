
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../notification.entity';
import { NotificationService } from '../notification.service';
import { NOTIFICATION_QUEUE, NotificationJob } from '../types/notification.constants';
import { Job } from 'bullmq';
import { NotificationEventPayload } from '../types/notification.types';

@Processor(NOTIFICATION_QUEUE)
export class NotificationConsumer extends WorkerHost {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
    private service: NotificationService
  ) {
    super();
  }
  async process(job: Job<NotificationEventPayload, any, NotificationJob>): Promise<Notification | void> {
    if (job.name !== NotificationJob.CREATE) return;

    const { userId, message } = job.data;
    const saved = await this.repo.save(
      this.repo.create({ userId, message }),
    );

    this.service.pushToClient(userId, saved);

    return saved;
  }
}
