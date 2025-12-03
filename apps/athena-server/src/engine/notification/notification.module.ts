
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';

import { Notification } from './notification.entity';
import { NOTIFICATION_QUEUE } from './types/notification.constants';
import { AthenaConfigModule } from '../athena-config/athena-config.module';
import { AthenaConfigService } from '../athena-config/athena-config.service';
import { NotificationService } from './notification.service';
import { NotificationConsumer } from './consumers/notification.consumer';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Notification]),
    BullModule.forRootAsync({
      imports: [AthenaConfigModule],
      inject: [AthenaConfigService],
      useFactory: (config: AthenaConfigService) => {
        return {
          connection: {
            host: config.get("REDIS_HOST"),
            port: config.get("REDIS_PORT")
            ,
            password: config.get("REDIS_PASSWORD"),
            tls: {}   // <= REQUIRED for Azure Cache for Redis
          },
        }
      }

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
