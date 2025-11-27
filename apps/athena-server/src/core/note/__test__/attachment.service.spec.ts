import { Test } from "@nestjs/testing"
import { AttachmentService } from "../services/attachment.service"
import { StorageService } from "apps/athena-server/src/engine/storage/services/storage.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { NoteAttachment } from "../entities/note-attachment.entity"
import { StorageKeyService } from "src/engine/storage/services/storage-key.service"
import { randomUUID } from "crypto"
import { UploadService } from "src/engine/storage/services/upload.service"
import { ContentTypes } from "@athena/types"

describe("AttachmentsService", () => {
  let attachment: AttachmentService
  let storage = {
    getUrl: jest.fn(),
    getPublicUrl: jest.fn()
  }
  let storageKey = {
    create: jest.fn(),
  }
  let upload = {
    createUpload: jest.fn()

  }

  let storageKeyMock = randomUUID();

  beforeEach(async () => {


    const module = await Test.createTestingModule({
      providers: [AttachmentService,
        {
          provide: StorageService,
          useValue: storage
        },
        {
          provide: UploadService,
          useValue: upload
        },
        {
          provide: StorageKeyService,
          useValue: storageKey
        },

        {
          provide: getRepositoryToken(NoteAttachment),
          useValue: {
            create: jest.fn(),
            save: jest.fn()

          }
        }
      ],
    }).compile()

    attachment = module.get(AttachmentService);
    storage = module.get(StorageService);
    upload = module.get(UploadService);
    storageKey = module.get(StorageKeyService);

    jest.clearAllMocks();
    storageKey.create.mockResolvedValue(storageKeyMock)
  })

  describe("defined", () => {
    it('should be defined', () => {
      expect(attachment).toBeDefined()
      expect(storage).toBeDefined()
    })
  })

  describe("basic operation", () => {


    it('get sign url', async () => {
      const mockJob = {
        key: "key",
        url: "url"
      }
      upload.createUpload.mockReturnValueOnce(mockJob);

      const url = await attachment.getUploadUrl("testId", ContentTypes.JPEG);

      expect(upload.createUpload).toHaveBeenCalled();

      expect(url).toEqual(mockJob.url)
    })

    it('get public url', async () => {
      const mockKey = "key";
      const mockUrl = "url"
      storage.getUrl.mockReturnValueOnce(mockUrl);
      const url = attachment.getPublicUrl(mockKey);
      expect(storage.getUrl).toHaveBeenCalledWith({ key: mockKey })
      expect(url).toEqual(mockUrl)

    })
  })

})
