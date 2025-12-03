import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";
import { NoteStorageSubscriber } from "./subscribers/note-storage.subscriber";
import { AttachmentService } from "./services/attachment.service";
import { ImageAsNoteService } from "./services/image-as-note.service";
import { CreateNoteFromImageHandler } from "./handlers/create-note-from-image.handler";
import { NoteAttachment } from "./entities/note-attachment.entity";
import { MarkdownService } from "./services/markdown.service";

@Module({
  imports: [TypeOrmModule.forFeature([Note, NoteAttachment])],

  providers: [NoteStorageSubscriber, AttachmentService, ImageAsNoteService, CreateNoteFromImageHandler, MarkdownService],
  exports: [TypeOrmModule, NoteModule, MarkdownService]
})
export class NoteModule { }
