import { ContentTypes } from '@athena/types';
import { Readable } from 'stream';
import { UploadCallback, UploadInstruction } from '@athena/types'

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
  /**
  * get read-only public or signed url
    */
  getUrl?(params: {
    key: string,
    expiresInSeconds?: number
  }): string;
  /**
  * get write or upload url
  */
  getUploadUrl?(params: {
    key: string,
    expiresInSeconds?: number;
  }): string

  getUploadInstruction(url?: string, callback?: UploadCallback): UploadInstruction
}
