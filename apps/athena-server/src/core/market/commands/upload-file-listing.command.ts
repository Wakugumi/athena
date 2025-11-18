import { Command } from "@nestjs/cqrs";
import { ContentTypes } from "@athena/types";

/**
 * Request to upload a file to existing list or new list
  * returns key of the future object and url of the upload endpoint
  */
export class UploadFileListingCommand extends Command<{
  key: string, url: string
}> {
  constructor(
    public readonly userId: string,
    public readonly contentType: ContentTypes,
    public readonly size: number,
    public readonly listingId?: string,
  ) {

    super();
  }
}
