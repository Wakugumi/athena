
import { StorageDriverOptions } from "../types/storage.types";

export class StorageUploadEvent {
  constructor(
    public readonly provider: StorageDriverOptions,
    public readonly bucket: string,
    public readonly key: string,
    public readonly size?: number,
    public readonly contentType?: string,

  ) { }

}
