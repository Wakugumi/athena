
import { StorageUploadEvent } from '../types/storage-upload-event.type';

export class FileUploadedEvent {
  constructor(public readonly payload: StorageUploadEvent) { }
}
