
import { Injectable, BadRequestException } from '@nestjs/common';
import { StorageWebhookAdapter } from '../webhook-adapters/storage-webhook-adapter.interface';
import { StorageUploadEvent } from '../types/storage-upload-event.type';

@Injectable()
export class StorageWebhookRouterService {
  constructor(
    private readonly adapters: StorageWebhookAdapter[],
  ) { }

  route(provider: string, payload: unknown): StorageUploadEvent {
    const adapter = this.adapters.find(a => a.supports(provider));

    if (!adapter) {
      throw new BadRequestException(`Unsupported storage provider: ${provider}`);
    }

    return adapter.normalize(payload);
  }
}
