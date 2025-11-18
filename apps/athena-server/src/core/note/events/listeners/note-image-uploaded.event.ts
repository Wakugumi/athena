import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NoteEvents } from "../enums/note-events.enum";
import { ImageAsNoteService } from "../../services/image-as-note.service";
import { StorageService } from "src/engine/storage/services/storage.service";

@EventsHandler(StorageUploadedEvent)
export class NoteImagetUploadedHandler implements IEventHandler<StorageUploadedEvent> {
  constructor(private readonly imageAsNoteService: ImageAsNoteService,
    private readonly storageService: StorageService) { }


  async handle(event: StorageUploadedEvent) {
    if (event.metadata?.context !== NoteEvents.IMAGE_NOTE) return;

    const url = this.storageService.getPublicUrl({ key: event.key })

    if (!event.metadata.userId) {
      throw new Error('no user id in event metadata')
    }
    await this.imageAsNoteService.generateNoteFromPhoto(event.metadata.userId!, url)

  }
}
