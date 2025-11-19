
import { Injectable, Logger } from '@nestjs/common';
import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob'; // Azure SDK
import { AthenaConfigService } from 'src/engine/athena-config/athena-config.service';
import { StorageUploadEvent } from '../types/storage-upload-event.type';
import { MarkdownService } from 'src/core/note/services/markdown.service';

@Injectable()
export class StorageProcessingService {
  private readonly logger = new Logger(StorageProcessingService.name);
  private client: BlobServiceClient;
  private container: ContainerClient;
  private sharedKeyCredential: StorageSharedKeyCredential;


  constructor(private readonly config: AthenaConfigService, private readonly markdownService: MarkdownService) {
    const accountName = this.config.get(
      'STORAGE_AZURE_ACCOUNT_NAME',
    );
    const accountKey = this.config.get('STORAGE_AZURE_ACCOUNT_KEY');
    const containerName = this.config.get(
      'STORAGE_AZURE_CONTAINER_NAME',
    );

    this.sharedKeyCredential = new StorageSharedKeyCredential(
      accountName, accountKey
    )


    this.client = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      this.sharedKeyCredential
    );

    this.container = this.client.getContainerClient(containerName);
  }


  private async streamToBuffer(readable: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of readable) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async convertImageToMarkdown(event: StorageUploadEvent): Promise<string> {
    const blobClient = this.container.getBlobClient(event.key);

    // Download image content
    const downloadResponse = await blobClient.download();


    let buffer: Buffer;

    if (downloadResponse.readableStreamBody instanceof Buffer) {
      buffer = downloadResponse.readableStreamBody;
    } else if (downloadResponse.readableStreamBody instanceof ArrayBuffer) {
      buffer = Buffer.from(downloadResponse.readableStreamBody);
    } else if (downloadResponse.readableStreamBody) {
      // Node.js stream: read into buffer
      buffer = await this.streamToBuffer(downloadResponse.readableStreamBody);
    } else {
      throw new Error(`Blob ${event.key} has no readableStreamBody`);
    }


    // Convert to Base64
    const base64 = buffer.toString('base64');

    // Generate Markdown content
    const markdownContent = `![${event.key}](data:image/${this.getExtension(event.key)};base64,${base64})`;

    // Create new Markdown blob key
    const mdBlobKey = event.key.replace(/\.(png|jpg|jpeg|gif)$/, '.md');
    const mdBlobClient = this.container.getBlockBlobClient(mdBlobKey);

    // Upload Markdown blob
    await mdBlobClient.upload(markdownContent, Buffer.byteLength(markdownContent));

    this.logger.log(`Converted image ${event.key} → markdown blob ${mdBlobKey}`);
    return mdBlobKey;
  }

  private getExtension(filename: string) {
    const match = filename.match(/\.(png|jpg|jpeg|gif)$/);
    return match ? match[1] : 'png';
  }

  private async downloadToBuffer(readable: any): Promise<Buffer> {
    if (!readable) throw new Error('Blob has no content');

    if (readable instanceof Buffer) return readable;
    if (readable instanceof ArrayBuffer) return Buffer.from(readable);

    // Node.js stream
    const chunks: Buffer[] = [];
    for await (const chunk of readable) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
  async generatePreview(blobKey: string): Promise<string> {
    const blobClient = this.container.getBlobClient(blobKey);
    const downloadResponse = await blobClient.download();
    const buffer = await this.downloadToBuffer(downloadResponse.readableStreamBody);
    const markdown = buffer.toString('utf-8');

    const preview = this.markdownService.generateTextPreview(markdown, 500);
    this.logger.log(`Generated preview for ${blobKey}: ${preview.substring(0, 50)}...`);
    return preview;
  }

}
