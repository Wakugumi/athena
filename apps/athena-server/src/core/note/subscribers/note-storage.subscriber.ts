
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AttachmentService } from '../services/attachment.service';
import { StorageDomain, StorageKeyService, StoragePurpose } from 'src/engine/storage/services/storage-key.service';
import { StorageEvents } from 'src/engine/storage/enums/storage-events.enum';
import { FileUploadedEvent } from 'src/engine/storage/events/file-uploaded.event';

@Injectable()
export class NoteStorageSubscriber {
  constructor(
    private readonly attachmentService: AttachmentService,
    @Inject(StorageKeyService) private readonly key: StorageKeyService,
  ) { }


  /**
  * Listen storage event when file uploaded.
  * Handle attachment record when file is uploaded
  */
  @OnEvent(StorageEvents.FILE_UPLOADED)
  async handleNoteAttachment(event: FileUploadedEvent) {
    const { key } = event.payload;


    const { domain, ownerId, purpose, extension, filename } = this.key.splitKey(key);

    // Route by prefix
    if (!key.includes(`/${StorageDomain.NOTE}/`)) return;
    if (purpose !== StoragePurpose.ATTACHMENT) return;


    await this.attachmentService.attachFileToNote(
      ownerId,
      key

    );

  }
}
