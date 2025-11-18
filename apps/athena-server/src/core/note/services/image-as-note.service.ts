import { AttachmentService } from "./attachment.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Note } from "../entities/note.entity";
import { ContentTypes } from "src/engine/storage/types/storage.types";
import { StorageService } from "src/engine/storage/services/storage.service";
import { SigedUrlPermission } from "src/engine/storage/types/storage-driver.interface";
import { NoteAttachment } from "../entities/note-attachment.entity";

/**
 * Transform image upload as Note
  */
export class ImageAsNoteService {

  constructor(@InjectRepository(Note) private readonly noteRepo: Repository<Note>,
    private readonly attachmentService: AttachmentService,
    private readonly storageService: StorageService) {

  }

  async uploadImage(userId: string, mimeType: ContentTypes) {

    const key = this.attachmentService.generateFileKey(userId, mimeType)
    const url = await this.storageService.getUrl({
      key: key,
      permissions: [SigedUrlPermission.WRITE],
      contentType: mimeType
    })


    return {
      key: key,
      url: url
    }

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
