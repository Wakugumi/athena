
import { Controller, Post, Body, Query, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StorageWebhookRouterService } from '../services/storage-webhook-router.service';
import { FileUploadedEvent } from '../events/file-uploaded.event';
import { StorageEvents } from '../enums/storage-events.enum';

@Controller('storage/webhook')
export class StorageWebhookController {
  constructor(
    private readonly router: StorageWebhookRouterService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @Post()
  handleWebhook(
    @Query('provider') provider: string,
    @Body() payload: unknown,
  ) {
    const normalized = this.router.route(provider, payload);

    this.eventEmitter.emit(
      StorageEvents.FILE_UPLOADED,
      new FileUploadedEvent(normalized),
    );

    return { status: 'ok' };
  }
}
