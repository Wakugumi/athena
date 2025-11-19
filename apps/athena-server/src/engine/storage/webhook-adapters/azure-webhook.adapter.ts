
import { Injectable, Logger } from '@nestjs/common';
import {
  AzureEventGridEnvelope,
  AzureBlobCreatedEvent,
} from '../types/azure-event-grid.types'
import { StorageWebhookAdapter } from './storage-webhook-adapter.interface';
import { StorageUploadEvent } from '../types/storage-upload-event.type';
import { StorageDriverOptions } from '../types/storage.types';

@Injectable()
export class AzureWebhookAdapter implements StorageWebhookAdapter {
  private readonly logger = new Logger(AzureWebhookAdapter.name);

  supports(provider: string): boolean {
    return provider === StorageDriverOptions.AZURE;
  }

  normalize(payload: unknown): StorageUploadEvent {
    const events = payload as AzureEventGridEnvelope[];

    // Azure always sends an array of events, but we normalize ONE.
    // Your controller should loop if needed.
    const event = events[0];

    const data = event.data as AzureBlobCreatedEvent;

    const url = new URL(data.url);
    const key = url.pathname.replace(/^\//, '');
    const bucket = url.host.split('.')[0]; // "<container>.blob.core…" → container name

    return {
      provider: StorageDriverOptions.AZURE,
      bucket,
      key,
      size: data.contentLength ?? 0,
      contentType: data.contentType ?? 'application/octet-stream',
      uploadedAt: new Date(event.eventTime),
      raw: payload,
    };
  }
}
