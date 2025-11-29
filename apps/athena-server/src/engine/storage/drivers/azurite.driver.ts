import {
  BlobServiceClient,
  ContainerClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  BlobSASSignatureValues,
  SASProtocol,
  BlobClient,
} from '@azure/storage-blob';
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
import { UploadCallback, UploadInstruction } from '@athena/types';

export class AzuriteDriver implements StorageDriver {
  private client: ContainerClient;
  private readonly logger = new Logger(AzuriteDriver.name);
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
      "devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==")

    this.container = new ContainerClient("DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;", options.container)


    this.logger.log(`Creating Azurite instance, container ${options.container}`);
    (async () => await this.container.createIfNotExists())()
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
    key: string
    expiresInSeconds?: number;
  }): Promise<string> {


    const blobClient = this.container.getBlobClient(params.key)

    if (!this.sharedKeyCredential) {
      throw new StorageException(
        "Account key is required for generating signed URLs",
        StorageExceptionCode.FILE_NOT_FOUND
      );
    }

    try {
      const now = Date.now();
      this.logger.log(`INITIATING SAS GENERATION ${this.options.container}/${params.key}`)
      const sasOptions: BlobSASSignatureValues = {
        containerName: this.options.container,
        permissions: BlobSASPermissions.parse("cw"),
        expiresOn: new Date(now + 5 * 60 * 1000)
      };

      const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        this.sharedKeyCredential
      ).toString();

      this.logger.log(`CREATED SAS TOKEN ${sasToken} \n ${params.key} ${this.options.container} \n ${this.sharedKeyCredential.accountName}`)


      return `${blobClient.url}?${sasToken}`;

    } catch (error) {
      this.logger.error("Error generating signed URL:", error);
      throw new StorageException(
        "Failed to generate signed URL",
        StorageExceptionCode.FILE_NOT_FOUND
      );
    }
  }
  getUploadInstruction(url?: string, callback?: UploadCallback): UploadInstruction {
    return {} as any
  }

  getUploadUrl(params: { key: string; expiresInSeconds?: number; }): string {
    return ""
  }
  getUrl(params: { key: string; expiresInSeconds?: number; }): string {
    return ""
  }
}
