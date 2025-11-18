
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AthenaConfigService } from 'src/engine/athena-config/athena-config.service';

export enum StorageDomain {
  NOTE = 'notes',
  LISTING = 'listings',
  USER = 'users',
  TEMP = 'temp',
  OCR = 'ocr',
  EXPORT = 'export',
}

export enum StoragePurpose {
  ATTACHMENT = 'attachments',
  RAW = 'raw',
  PROCESSED = 'processed',
  THUMB = 'thumb',
  AVATAR = 'avatar',
  UPLOADS = 'uploads',
  TEMP = 'temp',
  EXPORTS = 'exports',
}

export interface StorageKeyParams {
  domain: StorageDomain;
  ownerId?: string;
  purpose: StoragePurpose;
  extension: string;
  customName?: string;
}

@Injectable()
export class StorageKeyService {
  private readonly envPrefix: string;

  constructor(config: AthenaConfigService) {
    this.envPrefix = config.get('NODE_ENV') ?? 'dev';
  }

  create(params: StorageKeyParams): string {
    const { domain, ownerId, purpose, extension, customName } = params;

    const fileName = `${customName ?? randomUUID()}.${extension}`;

    // Prefix environment → safer cleanup and isolation
    const prefix = `${this.envPrefix}/${domain}`;

    if (!ownerId) {
      // For temp or jobs without a clear owner
      return `${prefix}/${fileName}`;
    }

    return `${prefix}/${ownerId}/${purpose}/${fileName}`;
  }

  splitKey(key: string) {

    const [domain, ownerId, purpose, extension, filename] = key.split('/')
    return { domain, ownerId, purpose, extension, filename }


  }
}
