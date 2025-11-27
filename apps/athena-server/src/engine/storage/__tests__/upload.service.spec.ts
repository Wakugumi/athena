import { UploadService } from "src/engine/storage/services/upload.service"
import { StorageService } from "../services/storage.service";
import { StorageKeyService } from "../services/storage-key.service";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UploadEntity } from "../entities/upload.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UploadPurpose } from "../enums/upload-purpose.enum";
import { UploadDomain } from "../enums/upload-domain.enum";
import { ContentTypes, UploadInstruction } from "@athena/types";
import { UpdateResult } from "typeorm";
import { UploadStatus } from "../enums/upload-status.enum";
import { StorageEvents } from "../enums/storage-events.enum";
import { FileUploadedEvent } from "../events/file-uploaded.event";
import { UPLOAD_CALLBACK_URL } from "../types/storage.tokens";

describe('Upload service', () => {
  let upload: UploadService;
  let storage = {
    getUrl: jest.fn(),
    getUploadUrl: jest.fn()
    ,
    getUploadInstruction: jest.fn()
  }
  let storageKey = {
    create: jest.fn()
  }
  let uploadRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneByOrFail: jest.fn(),
    update: jest.fn()
  }
  let eventEmitter = {
    emit: jest.fn()
  }


  beforeEach(async () => {

    let module = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: StorageService,
          useValue: storage
        },
        {
          provide: getRepositoryToken(UploadEntity),
          useValue: uploadRepo
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitter
        },
        {
          provide: StorageKeyService,
          useValue: storageKey
        },
        {
          provide: UPLOAD_CALLBACK_URL,
          useValue: "api/"
        }

      ]
    }).compile()


    storageKey = module.get(StorageKeyService);
    storage = module.get(StorageService);
    uploadRepo = module.get(getRepositoryToken(UploadEntity))
    eventEmitter = module.get(EventEmitter2)
    upload = module.get(UploadService)

    jest.clearAllMocks();
  })


  it('should be defined', () => {
    expect(upload).toBeDefined()
  })



  let jobMock = {
    id: '3aa1d65b-7fdd-4613-8197-d5f03b1f8958',
    purpose: UploadPurpose.ATTACHMENT,
    domain: UploadDomain.NOTE,
    referenceId: 'ea566ad8-2476-49e4-95d3-5cf2c32da496',
    contentType: ContentTypes.JPEG,
  }
  let keyMock = '386effb1-0f66-4fed-ac88-d19635cfb382'
  let urlMock = 'url'

  it('should create upload job', async () => {
    uploadRepo.create.mockResolvedValueOnce(jobMock);
    storageKey.create.mockReturnValue(keyMock);
    storage.getUploadUrl.mockReturnValueOnce(urlMock);
    storage.getUploadInstruction.mockReturnValueOnce({
      url: urlMock,
      method: "POST",
      callback: {} as any,
      headers: {} as any
    } as UploadInstruction)

    const result = await upload.createUpload({
      contentType: jobMock.contentType,
      domain: jobMock.domain,
      purpose: jobMock.purpose,
      referenceId: jobMock.referenceId
    })
    expect(result).toEqual<UploadInstruction>({
      url: urlMock,
      method: "POST",
      callback: expect.anything(),
      headers: expect.anything()

    })

    expect(uploadRepo.save).toHaveBeenCalled()
  })

  it('should mark complete', async () => {
    let updateResult: UpdateResult = { raw: "raw", generatedMaps: [{ status: UploadStatus.READY }], affected: 1 }
    uploadRepo.findOneByOrFail.mockResolvedValueOnce(jobMock);
    uploadRepo.update.mockResolvedValueOnce(updateResult)

    expect(await upload.markComplete(jobMock.id)).toBe(updateResult);
    expect(eventEmitter.emit).toHaveBeenCalledWith(StorageEvents.FILE_UPLOADED, expect.any(FileUploadedEvent))
  })
})
