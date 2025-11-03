import { dirname, join } from 'path';
import { StorageDriver } from '../types/storage-driver.interface';
import * as fs from 'fs/promises';
import {
  StorageException,
  StorageExceptionCode,
} from '../types/storage.exception';
import { createReadStream, existsSync } from 'fs';
import { Readable } from 'stream';

export interface LocalDriverOptions {
  storagePath: string;
  publicBaseUrl?: string;
}

export class LocalDriver implements StorageDriver {
  private options: LocalDriverOptions;

  constructor(options: LocalDriverOptions) {
    this.options = options;
  }

  async createFolder(path: string) {
    await fs.mkdir(path, { recursive: true });
  }

  async write(params: {
    file: Buffer | Uint8Array | string;
    name: string;
    folder: string;
    mimeType: string | undefined;
  }): Promise<void> {
    const filePath = join(
      `${this.options.storagePath}/`,
      params.folder,
      params.name,
    );

    const folderPath = dirname(filePath);
    await this.createFolder(folderPath);
    await fs.writeFile(filePath, params.file);
  }

  async move(params: {
    from: { folderPath: string; filename: string };
    to: { folderPath: string; filename: string };
  }): Promise<void> {
    const fromPath = join(
      `${this.options.storagePath}/`,
      params.from.folderPath,
      params.from.filename,
    );

    const toPath = join(
      `${this.options.storagePath}/`,
      params.to.folderPath,
      params.to.filename,
    );

    await this.createFolder(dirname(toPath)); // ensure folder exists, create if none

    try {
      await fs.rename(fromPath, toPath);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new StorageException(
          'File not found',
          StorageExceptionCode.FILE_NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async copy(
    params: {
      from: { folderPath: string; filename?: string };
      to: { folderPath: string; filename?: string };
    },
    toInMemory: boolean = false,
  ): Promise<void> {
    if (!params.from.filename && params.to.filename) {
      throw new Error('Cannot copy folder to file');
    }
    const fromPath = join(
      this.options.storagePath,
      params.from.folderPath,
      params.from.filename || '',
    );

    const toPath = join(
      toInMemory ? '' : this.options.storagePath,
      params.to.folderPath,
      params.to.filename || '',
    );

    await this.createFolder(dirname(toPath));

    try {
      await fs.cp(fromPath, toPath, { recursive: true });
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new StorageException(
          'File not found',
          StorageExceptionCode.FILE_NOT_FOUND,
        );
      }

      throw error;
    }
  }

  async download(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }): Promise<void> {
    await this.copy(params, true);
  }

  async checkFileExists(params: {
    folderPath: string;
    filename: string;
  }): Promise<boolean> {
    const filePath = join(
      this.options.storagePath,
      params.folderPath,
      params.filename,
    );

    return existsSync(filePath);
  }

  async checkFolderExists(folderPath: string): Promise<boolean> {
    const fullPath = join(this.options.storagePath, folderPath);
    return existsSync(fullPath);
  }

  async read(params: {
    folderPath: string;
    filename: string;
  }): Promise<Readable> {
    const filePath = join(
      this.options.storagePath,
      params.folderPath,
      params.filename,
    );

    if (!existsSync(filePath)) {
      throw new StorageException(
        'FIle not found',
        StorageExceptionCode.FILE_NOT_FOUND,
      );
    }

    try {
      return createReadStream(filePath);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new StorageException(
          'FIle not found',
          StorageExceptionCode.FILE_NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async delete(params: {
    folderPath: string;
    filename?: string;
  }): Promise<void> {
    const filePath = join(
      this.options.storagePath,
      params.folderPath,
      params.filename || '',
    );

    await fs.rm(filePath, { recursive: true });
  }

  async getSignedUrl(params: {
    folderPath: string;
    filename: string;
    expiresInSeconds?: number;
  }): Promise<string> {
    // For local storage, we just return the public URL
    // In a real implementation, you might want to generate a temporary token
    // or use a different approach for local file access control
    const filePath = join(
      this.options.storagePath,
      params.folderPath,
      params.filename,
    );

    // If publicBaseUrl is configured, use it
    if (this.options.publicBaseUrl) {
      const relativePath = filePath.replace(this.options.storagePath, '').replace(/^[\/\\]/, '');
      return `${this.options.publicBaseUrl}/${relativePath}`;
    }

    // Otherwise, return the local file path
    // Note: This is not a real "signed URL" but works for local development
    return filePath;
  }
}
