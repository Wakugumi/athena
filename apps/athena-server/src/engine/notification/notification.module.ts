
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';

import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { NotificationConsumer } from './consumers/notification.consumer';
import { NotificationController } from './notification.controller';
import { NOTIFICATION_QUEUE } from './types/notification.constants';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Notification]),
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
    }),
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
  ],
  providers: [NotificationService, NotificationConsumer],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule { }
