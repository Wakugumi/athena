import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadEntity } from "../entities/upload.entity";
import { Repository, UpdateResult } from "typeorm";
import { StorageKeyService } from "./storage-key.service";
import { ContentTypes } from "@athena/types";
import { UploadPurpose } from "../enums/upload-purpose.enum";
import { UploadDomain } from "../enums/upload-domain.enum";
import { resolveFileExtension } from "../utils/resolve-file-extension.util";
import { StorageService } from "./storage.service";
import { UploadStatus } from "../enums/upload-status.enum";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { StorageEvents } from "../enums/storage-events.enum";
import { FileUploadedEvent } from "../events/file-uploaded.event";
import { randomUUID } from "crypto";
import { UploadInstruction } from "@athena/types";
import { UPLOAD_CALLBACK_URL } from "../types/storage.tokens";

export interface UploadParams {
  domain: UploadDomain;
  purpose: UploadPurpose;
  contentType: ContentTypes;
  referenceId: string;
}

@Injectable()
export class UploadService {

  constructor(@InjectRepository(UploadEntity) private readonly uploadRepo: Repository<UploadEntity>,
    @Inject(UPLOAD_CALLBACK_URL) private readonly callback_url: string,
    private readonly keyService: StorageKeyService,
    private readonly storageService: StorageService,
    private readonly eventEmitter: EventEmitter2
  ) {

  }


  private generateCallbackUrl(uploadId: string) {
    return `${this.callback_url}/upload/${uploadId}`

  }

  async createUpload(params: UploadParams): Promise<UploadInstruction> {
    const uploadId = randomUUID()
    const upload = this.uploadRepo.create({
      id: uploadId,
      key: uploadId,
      purpose: params.purpose,
      referenceId: params.referenceId,
      contentType: params.contentType,
      domain: params.domain

    })
    await this.uploadRepo.save(upload)
    const key = this.keyService.create({
      referenceId: params.referenceId,
      domain: params.domain,
      purpose: params.purpose,
      uploadId: upload.id,
      extension: resolveFileExtension(params.contentType),
    })
    upload.key = key;
    const url = this.storageService.getUploadUrl({
      key: key,
    })
    await this.uploadRepo.save(upload)

    return this.storageService.getUploadInstruction(url, { url: this.generateCallbackUrl(uploadId), method: "POST" });
  }


  async markComplete(uploadId: string): Promise<UpdateResult> {
    const upload = await this.uploadRepo.findOneByOrFail({ id: uploadId });
    const result = await this.uploadRepo.update({ id: uploadId }, { status: UploadStatus.READY })


    const event: FileUploadedEvent = new FileUploadedEvent(uploadId, upload.domain, upload.purpose)

    this.eventEmitter.emit(StorageEvents.FILE_UPLOADED, event)

    return result

  }


  async lookupJob(uploadId: string): Promise<UploadEntity> {
    return await this.uploadRepo.findOneByOrFail({ id: uploadId })
  }
}
