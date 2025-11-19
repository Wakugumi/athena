
import { Injectable, Logger } from '@nestjs/common';
import { AzureEventGridEvent } from '../types/azure-event-grid.types';
import { StorageUploadEvent } from '../types/storage-upload-event.type';
import { StorageDriverOptions } from '../types/storage.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StorageEvents } from '../enums/storage-events.enum';

@Injectable()
export class AzureWebhookAdapter {
  private readonly logger = new Logger(AzureWebhookAdapter.name);

  constructor(private readonly eventEmitter: EventEmitter2) { }
  /**
   * Handle raw Event Grid events
   */
  handleEvent(event: AzureEventGridEvent) {
    try {
      const normalized = this.normalizeEvent(event);
      if (normalized) {
        this.processUpload(normalized);
      }
    } catch (err) {
      this.logger.error('Failed to handle event', err);
    }
  }

  /**
   * Normalize Event Grid / Azure Storage event to common format
   */
  private normalizeEvent(event: AzureEventGridEvent): StorageUploadEvent | null {
    if (!event || !event.data) return null;

    switch (event.eventType) {
      case 'Microsoft.Storage.BlobCreated':
      case 'Microsoft.Storage.BlobDeleted': {
        const url = event.data.url; // full blob URL
        const subject = event.subject; // optional fallback

        // Extract bucket (container)
        let bucket = '';
        let key = '';

        if (url) {
          const urlParts = new URL(url);
          const pathSegments = urlParts.pathname.split('/').filter(Boolean); // removes empty segments
          bucket = pathSegments[0]; // first segment is container
          key = pathSegments.slice(1).join('/'); // remaining is blob key
        } else if (subject) {
          const parts = subject.split('/blobs/');
          if (parts.length === 2) {
            key = parts[1];
            const containerMatch = parts[0].match(/containers\/([^\/]+)/);
            if (containerMatch) {
              bucket = containerMatch[1];
            }
          }
        }

        return {
          provider: StorageDriverOptions.AZURE,
          bucket,
          key,
          size: event.data.contentLength,
          contentType: event.data.contentType,
        };
      }

      default:
        this.logger.warn(`Unhandled event type: ${event.eventType}`);
        return null;
    }
  }

  /**
   * Process normalized upload event
   */
  private processUpload(event: StorageUploadEvent) {
    this.logger.log(
      `Received ${event.provider} event for bucket=${event.bucket} key=${event.key}`,
    );
    this.eventEmitter.emit(StorageEvents.FILE_UPLOADED, event)


  }
}
