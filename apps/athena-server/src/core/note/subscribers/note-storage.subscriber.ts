
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AttachmentService } from '../services/attachment.service';
import { StorageEvents } from 'src/engine/storage/enums/storage-events.enum';
import { FileUploadedEvent } from 'src/engine/storage/events/file-uploaded.event';
import { UploadDomain } from 'src/engine/storage/enums/upload-domain.enum';
import { UploadPurpose } from 'src/engine/storage/enums/upload-purpose.enum';
import { UploadService } from 'src/engine/storage/services/upload.service';

@Injectable()
export class NoteStorageSubscriber {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly uploadService: UploadService,
  ) { }


  /**
  * Listen storage event when file uploaded.
  * Handle attachment record when file is uploaded
  */
  @OnEvent(StorageEvents.FILE_UPLOADED)
  async handleNoteAttachment(event: FileUploadedEvent) {
    if (event.domain !== UploadDomain.NOTE && event.purpose !== UploadPurpose.ATTACHMENT) return;


    const uploadJob = await this.uploadService.lookupJob(event.uploadId)

    await this.attachmentService.attachFileToNote(
      uploadJob.referenceId,
      uploadJob.key
    );

  }
}
