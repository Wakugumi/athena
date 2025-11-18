import { StorageUploadEvent } from "../types/storage-upload-event.type";


export interface StorageWebhookAdapter {
  supports(provider: string): boolean;
  normalize(payload: unknown): StorageUploadEvent;
}
