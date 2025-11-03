import {
  BlobServiceClient,
  ContainerClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { StorageDriver } from '../types/storage-driver.interface';
import {
  StorageException,
  StorageExceptionCode,
} from '../types/storage.exception';
import { join } from 'path';
import { isDefined } from 'class-validator';
import { mkdir } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { AzureBlobOptions } from '../types/storage.types';
import { Logger } from '@nestjs/common';

export class AzureDriver implements StorageDriver {
  private client: BlobServiceClient;
  private readonly logger = new Logger(AzureDriver.name);
  private container: ContainerClient;
  private options: AzureBlobOptions;
  private sharedKeyCredential: StorageSharedKeyCredential;

  constructor(options: AzureBlobOptions) {
    if (!options.accountKey) {
      throw new StorageException(
        "Only support authenticate with account key, usually paired with account name",
        StorageExceptionCode.INVALID_CONFIGURATION
      )
    }
    this.options = options;
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      options.accountName, options.accountKey
    )


    this.client = new BlobServiceClient(
      `https://${options.accountName}.blob.core.windows.net`,
      this.sharedKeyCredential
    );

    this.container = this.client.getContainerClient(options.container);
  }

  async checkFileExists(params: {
    folderPath: string;
    filename: string;
  }): Promise<boolean> {
    const filePath = `${params.folderPath}/${params.filename}`;

    try {
      return await this.container.getBlockBlobClient(filePath).exists();
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async delete(params: {
    folderPath: string;
    filename?: string;
  }): Promise<void> {
    const filePath = `${params.folderPath}/${params.filename}`;

    try {
      await this.container.getBlobClient(filePath).deleteIfExists();
    } catch (error) {
      throw error;
    }
  }

  async read(params: { folderPath: string; filename: string }) {
    const filePath = `${params.folderPath}/${params.filename}`;

    try {
      const file = await this.container.getBlobClient(filePath).download();

      if (file.readableStreamBody === undefined) {
        throw new StorageException(
          'Cannot read file',
          StorageExceptionCode.FILE_NOT_FOUND,
        );
      }
      return file.readableStreamBody;
    } catch (error) {
      if ((error as any).code === 'ENOENT')
        throw new StorageException(
          'File not found',
          StorageExceptionCode.FILE_NOT_FOUND,
        );

      throw error;
    }
  }

  async write(params: {
    file: Buffer | Uint8Array | string;
    name: string;
    folder: string;
    mimeType: string | undefined;
  }): Promise<void> {
    const filePath = `${params.folder}/${params.name}`;

    try {
      await this.container
        .getBlockBlobClient(filePath)
        .upload(params.file, params.file.length);
    } catch (error) {
      throw error;
    }
  }

  async move(params: {
    from: { folderPath: string; filename: string };
    to: { folderPath: string; filename: string };
  }): Promise<void> {
    const fromPath = join(params.from.folderPath, params.from.filename);

    const fromBlob = this.container.getBlockBlobClient(fromPath);
    try {
      await this.copy(params);
      await fromBlob.delete();
    } catch (error) {
      throw error;
    }
  }

  async copy(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }): Promise<void> {
    const fromPath = join(params.from.folderPath, params.from.filename || '');
    const toPath = join(params.to.folderPath, params.to.filename || '');

    const fromBlob = this.container.getBlockBlobClient(fromPath);
    const toBlob = this.container.getBlockBlobClient(toPath);

    // check if destination already exist
    if (await toBlob.exists())
      throw new StorageException(
        'File already exist',
        StorageExceptionCode.FILE_ALREADY_EXISTS,
      );

    // check the file exist
    if ((await fromBlob.exists()) == false)
      throw new StorageException(
        'File not found',
        StorageExceptionCode.FILE_NOT_FOUND,
      );

    try {
      (await toBlob.beginCopyFromURL(fromBlob.url)).pollUntilDone();
    } catch (error) {
      throw error;
    }
  }

  async download(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }): Promise<void> {
    if (!params.from.filename && params.to.filename) {
      throw new Error('Cannot copy folder to file');
    }
    if (!params.from.filename) {
      throw new Error('Downloading whole dir not supported yet');
    }

    if (isDefined(params.from.filename)) {
      try {
        const dir = params.to.folderPath;
        await mkdir(dir, { recursive: true });
        const fileStream = await this.read({
          folderPath: params.from.folderPath,
          filename: params.from.filename!,
        });

        const toPath = join(
          params.to.folderPath,
          params.to.filename || params.from.filename,
        );
        await pipeline(fileStream, createWriteStream(toPath));
      } catch (error) {
        throw error;
      }
    }
  }

  async getSignedUrl(params: {
    folderPath: string;
    filename: string;
    expiresInSeconds?: number;
  }): Promise<string> {
    const filePath = `${params.folderPath}/${params.filename}`;
    const blobClient = this.container.getBlobClient(filePath);

    if (!this.sharedKeyCredential) {
      throw new StorageException(
        'Account key is required for generating signed URLs',
        StorageExceptionCode.FILE_NOT_FOUND,
      );
    }

    try {
      const expiresOn = new Date();
      expiresOn.setSeconds(
        expiresOn.getSeconds() + (params.expiresInSeconds || 3600),
      );

      const sasOptions = {
        containerName: this.options.container,
        blobName: filePath,
        permissions: BlobSASPermissions.parse('r'), // read permission
        startsOn: new Date(),
        expiresOn,
      };

      const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        this.sharedKeyCredential,
      ).toString();

      return `${blobClient.url}?${sasToken}`;
    } catch (error) {
      this.logger.error('Error generating signed URL:', error);
      throw new StorageException(
        'Failed to generate signed URL',
        StorageExceptionCode.FILE_NOT_FOUND,
      );
    }
  }
}
