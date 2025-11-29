import { Injectable } from '@nestjs/common';
import { AthenaConfigService } from 'src/engine/athena-config/athena-config.service';
import { UploadDomain } from '../enums/upload-domain.enum';
import { UploadPurpose } from '../enums/upload-purpose.enum';


export interface StorageKeyParams {
  domain: UploadDomain;
  referenceId: string;
  purpose: UploadPurpose;
  extension: string;
  uploadId: string
  customName?: string | undefined;
}

@Injectable()
export class StorageKeyService {
  private readonly envPrefix: string;

  constructor(config: AthenaConfigService) {
    this.envPrefix = config.get('NODE_ENV') ?? 'dev';
  }

  create(params: StorageKeyParams): string {

    let fileName = `${params.uploadId}.${params.extension}`;
    if (params.customName)
      fileName = `${params.customName}.${params.extension}`;


    // Prefix environment → safer cleanup and isolation
    const prefix = `${this.envPrefix}/${params.domain}`;

    if (!params.referenceId) {
      // For temp or jobs without a clear owner
      return `${prefix}/${fileName}`;
    }

    return `${prefix}/${params.purpose}/${params.referenceId}/${fileName}`;
  }

  splitKey(key: string) {

    const [env, domain, purpose, referenceId, filename] = key.split('/')
    return { env, domain, purpose, referenceId, filename }


  }
}
