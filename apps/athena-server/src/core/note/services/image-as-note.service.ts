import { AttachmentService } from "./attachment.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Note } from "../entities/note.entity";
import { NoteAttachment } from "../entities/note-attachment.entity";
import { UploadService } from "src/engine/storage/services/upload.service";
import { UploadDomain } from "src/engine/storage/enums/upload-domain.enum";
import { UploadPurpose } from "src/engine/storage/enums/upload-purpose.enum";
import { ContentTypes } from "@athena/types";

/**
 * Transform image upload as Note
  */
export class ImageAsNoteService {

  constructor(@InjectRepository(Note) private readonly noteRepo: Repository<Note>,
    private readonly attachmentService: AttachmentService,
    private readonly uploadService: UploadService) {

  }

  async uploadImage(userId: string, mimeType: ContentTypes) {
    const uploadJob = await this.uploadService.createUpload(
      {
        contentType: mimeType,
        domain: UploadDomain.NOTE,
        purpose: UploadPurpose.UPLOADS,
        referenceId: userId
      }
    )

    return uploadJob

  }

  private generateTitle(): string {
    return `photonote_${(new Date()).toISOString()}`
  }

  /**
     * Create a Note whose markdown content is a list of images.
     * Used in event handler
     *
     * @param userId
     * @param imageUrls array of uploaded image URLs
     */
  async generateNoteFromPhoto(userId: string, attachment: NoteAttachment) {


    const note = this.noteRepo.create({
      ownerId: userId,
      title: this.generateTitle()
    })
    note.content = this.attachmentService.injectAttachment(note, attachment)

    return this.noteRepo.save(note)
  }

}
