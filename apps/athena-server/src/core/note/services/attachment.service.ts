import { Injectable } from "@nestjs/common";
import { StorageService } from "src/engine/storage/services/storage.service";
import { Note } from "../entities/note.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NoteAttachment } from "../entities/note-attachment.entity";
import { UploadDomain } from "src/engine/storage/enums/upload-domain.enum";
import { UploadPurpose } from "src/engine/storage/enums/upload-purpose.enum";
import { UploadService } from "src/engine/storage/services/upload.service";
import { ContentTypes } from "@athena/types";

/**
 * Handling note's attachments
 */
@Injectable()
export class AttachmentService {


  constructor(
    @InjectRepository(NoteAttachment) private readonly attachmentRepo: Repository<NoteAttachment>,
    private readonly uploadService: UploadService, private readonly storageService: StorageService) {

  }

  async getUploadUrl(noteId: string, mimeType: ContentTypes) {
    const uploadJob = await this.uploadService.createUpload({
      domain: UploadDomain.NOTE,
      purpose: UploadPurpose.ATTACHMENT,
      referenceId: noteId,
      contentType: mimeType
    })


    return uploadJob.url

  }

  getPublicUrl(fileKey: string) {
    return this.storageService.getUrl({ key: fileKey })
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
    const attachment = this.attachmentRepo.create({
      key: key,
      noteId: noteId,
    })

    return await this.attachmentRepo.save(attachment);

  }

}
