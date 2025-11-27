import { Test } from "@nestjs/testing"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import { StorageKeyService } from "src/engine/storage/services/storage-key.service"
import { StorageService } from "src/engine/storage/services/storage.service"
import { Listing } from "src/core/listing/entities/listing.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ListingService } from "src/core/listing/services/listing.service"
import { Repository } from "typeorm";
import { Currency, License, ListingStatus, Visibility } from "@athena/types";
import { ListingException, ListingExceptionCode } from "../listing.exception";
import { StorageDriverFactory } from "src/engine/storage/storage-driver.factory";
import { STORAGE_OPTIONS } from "src/engine/storage/types/storage.tokens";
import { AthenaConfigService } from "src/engine/athena-config/athena-config.service";
import { StorageModule } from 'src/engine/storage/storage.module';
import { ListingModule } from 'src/core/listing/listing.module';
import { AthenaConfigModule } from 'src/engine/athena-config/athena-config.module'
import { observeNotification } from "rxjs/internal/Notification";
import { UploadService } from "src/engine/storage/services/upload.service";
import { ListingItem } from "../entities/listing-item.entity";


describe('Listing Service', () => {

  let service: ListingService
  let eventEmitter: EventEmitter2;
  let uploadService = {
    createUpload: jest.fn(),
    markComplete: jest.fn()

  }
  let storageKeyService = {
    create: jest.fn(),
  }

  let mockRepository = {
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOneByOrFail: jest.fn()
  }
  let listingRepo = mockRepository;
  let listingItemRepo = mockRepository;

  beforeEach(async () => {

    let module = await Test.createTestingModule({
      imports: [AthenaConfigModule, StorageModule],

      providers: [
        ListingService,
        {
          provide: UploadService,
          useValue: uploadService
        },
        {
          provide: StorageKeyService,
          useValue: storageKeyService
        },
        {
          provide: STORAGE_OPTIONS,
          useValue: {
            options: {
              publicBaseUrl: "http://test.test/"
            }

          }


        },
        {
          provide: getRepositoryToken(Listing),
          useValue: mockRepository
        },
        {
          provide: getRepositoryToken(ListingItem),
          useValue: mockRepository
        },
        EventEmitter2
      ]


    }).compile();


    service = module.get(ListingService);
    uploadService = module.get(UploadService)
    storageKeyService = module.get(StorageKeyService)
    eventEmitter = module.get(EventEmitter2)
    listingRepo = module.get(getRepositoryToken(Listing))
    listingItemRepo = module.get(getRepositoryToken(ListingItem))

    jest.clearAllMocks()
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  });


  describe('listing operations', () => {
    let mockItem = {
      id: "1",
      title: "item",
      preview: 'preview',

      blobKey: 'key',
      listingId: "1",
      createdAt: new Date().toISOString(),
    }
    let mockListing = {
      id: "1",
      ownerId: "1",
      status: ListingStatus.DRAFT,
      visibility: Visibility.DRAFT,
      description: "description",
      preview: "preview",
      currency: Currency.TOKEN,
      downloads: 1,
      itemsExpectedCount: 1,
      itemsProcessedCount: 1,
      title: "title",
      summary: "summary",
      license: License.OPEN,
      price: 100,
    }

    let mockUser = {
      id: "1"
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('ensure draft match owners', async () => {
      listingRepo.findOneBy.mockResolvedValueOnce(mockListing)
      expect(await service.ensureUserOwnsListing(mockUser.id, mockListing.id)).toBeUndefined()

    });

    it('ensure listing is under draft state', async () => {
      listingRepo.findOneByOrFail.mockResolvedValueOnce(mockListing);
      expect(await service.ensureDraft(mockListing.id)).toBeUndefined()
    });


    it('should create new draft', async () => {
      let mockPayload = {
        title: "test",
        ownerId: "1"
      }
      let mockResult = {
        ...mockPayload,
        Visibility: Visibility.DRAFT,
        status: ListingStatus.DRAFT
      }
      listingRepo.save.mockResolvedValueOnce(mockResult);
      const result = await service.draftListing(mockPayload)
      expect(result).toEqual(
        mockResult)

    });


    it('should update draft', async () => {

      let existingDraft: Partial<Listing> = {
        id: "1",
        title: "test",
        visibility: Visibility.DRAFT,
        status: ListingStatus.DRAFT
      }
      let updatedDraft: Partial<Listing> = {
        ...existingDraft,
        title: "update"
      }

      listingRepo.findOneByOrFail.mockResolvedValueOnce(existingDraft)
      listingRepo.update.mockResolvedValueOnce(updatedDraft)
      listingRepo.findOneBy.mockResolvedValueOnce(updatedDraft)
      const result = await service.updateDraft(existingDraft.id!, { title: "update" })
      expect(listingRepo.update).toHaveBeenCalledWith(existingDraft.id, { title: "update" })
      expect(result).toEqual(updatedDraft)
    });


    it('should not update published listing', async () => {
      let existingListing: Partial<Listing> = {
        id: "1",
        visibility: Visibility.PRIVATE,
        status: ListingStatus.PUBLISHED
      }

      listingRepo.findOneByOrFail.mockResolvedValueOnce(existingListing)
      expect.assertions(2)
      try {
        await service.updateDraft(existingListing.id!, { title: "update" });
      } catch (error) {
        expect(error).toBeInstanceOf(ListingException);
        expect((error as ListingException).code).toEqual(ListingExceptionCode.LISTING_ALREADY_PUBLISHED)
      }
    });

    it('should publish', async () => {
      let mockDraft = {
        id: "1",
        visibility: Visibility.DRAFT,
        status: ListingStatus.READY
      }

      listingRepo.findOneBy.mockResolvedValueOnce(mockDraft);
      jest.spyOn(listingRepo, 'save').mockImplementation(async (l) => l);
      const result = await service.publishListing(mockDraft.id);
      expect(listingRepo.findOneBy).toHaveBeenCalled()
      expect(listingRepo.save).toHaveBeenCalled()
      expect(result.visibility).toBe(Visibility.PUBLIC)
      expect(result.status).toBe(ListingStatus.PUBLISHED)
      expect(result.publishedAt).toBeDefined()


    });

    it('should not publish unready draft', async () => {
      let mockDraft = {
        ...mockListing,
        status: ListingStatus.PROCESSING
      }

      listingRepo.findOneBy.mockResolvedValueOnce(mockDraft);
      expect.assertions(2)

      try {

        await service.publishListing(mockDraft.id);
      } catch (error) {
        expect(error).toBeInstanceOf(ListingException);
        expect((error as ListingException).code).toEqual(ListingExceptionCode.LISTING_NOT_READY)
      }



    })


  })


})
