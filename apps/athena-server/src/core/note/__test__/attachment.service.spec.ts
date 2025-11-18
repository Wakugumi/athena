import { Test, TestingModule } from "@nestjs/testing"
import { AttachmentService } from "../services/attachment.service"
import { StorageService } from "apps/athena-server/src/engine/storage/services/storage.service"
import { } from '@athena/types'
import { ContentTypes } from "apps/athena-server/src/engine/storage/types/storage.types"

describe("AttachmentsService", () => {
  let attachment: AttachmentService
  let storage = {
    getUrl: jest.fn(),
    getPublicUrl: jest.fn()
  }
  beforeEach(async () => {


    const module = await Test.createTestingModule({

      providers: [AttachmentService,
        {
          provide: StorageService,
          useValue: storage
        }],


    }).compile()
    attachment = module.get(AttachmentService);
    storage = module.get(StorageService);
  })

  describe("defined", () => {
    it('should be defined', () => {
      expect(attachment).toBeDefined()
      expect(storage).toBeDefined()
    })
  })

  describe("basic operation", () => {


    it('get sign url', async () => {
      const mockUrl = "test";
      storage.getUrl.mockReturnValueOnce(mockUrl);

      const url = await attachment.getUploadUrl("testId", ContentTypes.JPEG);

      expect(storage.getUrl).toHaveBeenCalled();

      expect(url).toEqual(mockUrl)



    })

    it('get public url', async () => {
      const mockKey = "key";
      const mockUrl = "url"
      storage.getPublicUrl.mockReturnValueOnce(mockUrl);
      const url = await attachment.getPublicUrl(mockKey);
      expect(storage.getPublicUrl).toHaveBeenCalledWith({ key: mockKey })
      expect(url).toEqual(mockUrl)

    })
  })

})
