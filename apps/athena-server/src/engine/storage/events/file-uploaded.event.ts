import { UploadDomain } from "../enums/upload-domain.enum";
import { UploadPurpose } from "../enums/upload-purpose.enum";

/**
 * Passing the uploadId for event handler to query upload job record.
 * domain and purpose are guaranteed immutable.
 * Letting the handler query DB again for data persistent
  */
export class FileUploadedEvent {
  constructor(public readonly uploadId: string,
    public readonly domain: UploadDomain,
    public readonly purpose: UploadPurpose) { }
}
