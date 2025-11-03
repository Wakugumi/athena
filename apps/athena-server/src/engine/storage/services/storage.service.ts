import { Inject, Injectable } from '@nestjs/common';
import { STORAGE_OPTIONS, STORAGE_STRATEGY } from '../types/storage.tokens';
import { ContentTypes, GetUrlOptions } from '../types/storage.types';
import { StorageDriver } from '../types/storage-driver.interface';
import { Readable } from 'stream';
import { StorageDriverFactory } from '../storage-driver.factory';

@Injectable()
export class StorageService implements StorageDriver {
  private driver: StorageDriver;
  constructor(
    private readonly storageFactory: StorageDriverFactory,
    @Inject(STORAGE_OPTIONS) private readonly options: any,
  ) {
    this.driver = storageFactory.getCurrentDriver();
  }

  private splitKey(key: string): { folder: string; name: string } {
    const normalized = key.replace(/^\/+|\/+$/g, '');
    const lastSlashIdx = normalized.lastIndexOf('/');
    if (lastSlashIdx === -1) return { folder: '', name: normalized };
    return {
      folder: normalized.substring(0, lastSlashIdx),
      name: normalized.substring(lastSlashIdx + 1),
    };
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (chunk) =>
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
      );
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  read(params: {
    folderPath: string;
    filename: string;
  }): Promise<Readable | ReadableStream | NodeJS.ReadableStream | undefined> {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.read(params);
  }

  write(params: {
    file: Buffer | Uint8Array | string;
    name: string;
    folder: string;
    mimeType: ContentTypes | undefined;
  }) {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.write(params);
  }

  async delete(params: {
    folderPath: string;
    filename?: string;
  }): Promise<void> {
    await this.driver.delete(params);
  }

  async exists(key: string): Promise<boolean> {
    const { folder, name } = this.splitKey(key);
    return this.driver.checkFileExists({
      folderPath: folder,
      filename: name,
    });
  }

  move(params: {
    from: { folderPath: string; filename: string };
    to: { folderPath: string; filename: string };
  }): Promise<void> {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.move(params);
  }

  copy(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }) {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.copy(params);
  }

  download(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }) {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.download(params);
  }

  checkFileExists(params: {
    folderPath: string;
    filename: string;
  }): Promise<boolean> {
    const driver = this.storageFactory.getCurrentDriver();
    return driver.checkFileExists(params);
  }

  async getUrl(
    options: GetUrlOptions & { key: string },
  ): Promise<string | undefined> {
    const { key, signed, expiresInSeconds } = options;

    if (signed && this.driver.getSignedUrl) {
      const { folder, name } = this.splitKey(key);
      return this.driver.getSignedUrl({
        folderPath: folder,
        filename: name,
        expiresInSeconds,
      });
    }

    return this.buildPublicUrl(key);
  }

  private buildPublicUrl(key: string): string | undefined {
    const publicBaseUrl: string | undefined =
      this.options?.options?.publicBaseUrl;
    if (!publicBaseUrl) return undefined;
    const normalizedKey = key.replace(/^\/+/, '');
    return `${publicBaseUrl.replace(/\/$/, '')}/${normalizedKey}`;
  }
}
