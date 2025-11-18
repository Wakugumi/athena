import { Command } from "@nestjs/cqrs";
import { ContentTypes } from "src/engine/storage/types/storage.types";

/**
 * Create a note by uploading an image.
 * Returns an sign url for upload.
  * Further process initiated by storage webhook
  */
export class CreateNoteFromImageCommand extends Command<{ key: string, url: string }> {
  constructor(
    public readonly userId: string,
    public readonly contentType: ContentTypes
  ) {
    super();
  }

}
