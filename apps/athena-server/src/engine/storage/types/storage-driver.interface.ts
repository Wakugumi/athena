import { Readable } from 'stream';
import { ContentTypes } from './storage.types';

export interface StorageDriver {
  delete(params: { folderPath: string; filename?: string }): Promise<void>;
  read(params: {
    folderPath: string;
    filename: string;
  }): Promise<Readable | ReadableStream | NodeJS.ReadableStream | undefined>;
  write(params: {
    file: Buffer | Uint8Array | string;
    name: string;
    folder: string;
    mimeType: ContentTypes | undefined;
  }): Promise<void>;
  move(params: {
    from: { folderPath: string; filename: string };
    to: { folderPath: string; filename: string };
  }): Promise<void>;
  copy(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }): Promise<void>;
  download(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }): Promise<void>;
  checkFileExists(params: {
    folderPath: string;
    filename: string;
  }): Promise<boolean>;
  checkFolderExists?(folderPath: string): Promise<boolean>;
  getSignedUrl?(params: {
    folderPath: string;
    filename: string;
    expiresInSeconds?: number;
  }): Promise<string>;
}
