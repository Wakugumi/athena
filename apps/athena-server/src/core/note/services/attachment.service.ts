import { Injectable } from "@nestjs/common";
import { StorageService } from "src/engine/storage/services/storage.service";
import { SigedUrlPermission } from "src/engine/storage/types/storage-driver.interface";
import { ContentTypes } from "src/engine/storage/types/storage.types";
import { Note } from "../entities/note.entity";
import { StorageDomain, StorageKeyService, StoragePurpose } from "src/engine/storage/services/storage-key.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NoteAttachment } from "../entities/note-attachment.entity";

/**
 * Handling note's attachments
 */
@Injectable()
export class AttachmentService {


  constructor(
    @InjectRepository(NoteAttachment) private readonly attachmentRepo: Repository<NoteAttachment>,
    private readonly storageService: StorageService, private readonly storageKey: StorageKeyService) {

  }

  generateFileKey(noteId: string, mediaType: ContentTypes) {
    return this.storageKey.create({
      ownerId: noteId,
      domain: StorageDomain.NOTE,
      purpose: StoragePurpose.ATTACHMENT,
      extension: mediaType === ContentTypes.JPEG ? "jpeg" : mediaType === ContentTypes.PNG ? "png" : "webp"
    })

  }

  async getUploadUrl(userId: string, mimeType: ContentTypes) {
    const key = this.generateFileKey(userId, mimeType);
    const url = await this.storageService.getUrl({
      permissions: [SigedUrlPermission.WRITE],
      contentType: mimeType,
      key: key,
    })


    return url

  }

  getPublicUrl(fileKey: string) {
    return this.storageService.getPublicUrl({ key: fileKey })
  }


  injectAttachment(note: Note, attachment: NoteAttachment) {
    const markdownLine = `![attachment](${this.buildRef(attachment.id)})`;

    return note.content.length === 0
      ? markdownLine
      : `${note.content}\n\n${markdownLine}`;
  }


  private buildRef(id: string): string {
    return `attachment://${id}`;
  }


  async attachFileToNote(noteId: string, key: string) {
    // TODO: Throw exception if note not found
    //
    const attachment = this.attachmentRepo.create({
      key: key,
      noteId: noteId,
    })

    return await this.attachmentRepo.save(attachment);



  }

}
