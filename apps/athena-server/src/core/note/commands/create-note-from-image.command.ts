import { ContentTypes, UploadInstruction } from "@athena/types";
import { Command } from "@nestjs/cqrs";

/**
 * Create a note by uploading an image.
 * Returns an sign url for upload.
  * Further process initiated by storage webhook
  */
export class CreateNoteFromImageCommand extends Command<UploadInstruction> {
  constructor(
    public readonly userId: string,
    public readonly contentType: ContentTypes
  ) {
    super();
  }

}
