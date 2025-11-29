import { Command } from "@nestjs/cqrs";
import { ContentTypes } from "@athena/types";
import { UploadInstruction } from "@athena/types";

/**
 * Request to upload a file to existing list or new list
  * returns key of the future object and url of the upload endpoint
  */
export class UploadFileListingCommand extends Command<UploadInstruction> {
  constructor(
    public readonly userId: string,
    public readonly contentType: ContentTypes,
    public readonly listingId?: string | null,
  ) {

    super();
  }
}
