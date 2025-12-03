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
import { mock } from "node:test";
import { ListingEvents } from "../enums/listing-events.enum";
import { ListingDeleteEvent } from "../events/listing-delete.event";


describe('Listing Service', () => {

  let service: ListingService
  let eventEmitter = {
    emit: jest.fn()
  }
  let uploadService = {
    createUpload: jest.fn(),
    markComplete: jest.fn()

  }
  let storage = {
    splitKey: jest.fn(),
    delete: jest.fn()
  }
  let storageKeyService = {
    create: jest.fn(),
  }

  let mockRepository = {
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOneByOrFail: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    manager: jest.fn().mockReturnThis(),
    transaction: jest.fn().mockReturnThis()
  }
  let listingRepo = mockRepository;
  let listingItemRepo = mockRepository;

  beforeEach(async () => {

    let module = await Test.createTestingModule({
      imports: [AthenaConfigModule, StorageModule],

      providers: [
        ListingService,
        {
          provide: StorageService,
          useValue: storage
        },
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
        {
          provide: EventEmitter2,
          useValue: eventEmitter
        }
      ]


    }).compile();


    service = module.get(ListingService);
    uploadService = module.get(UploadService)
    storageKeyService = module.get(StorageKeyService)
    eventEmitter = module.get(EventEmitter2)
    listingRepo = module.get(getRepositoryToken(Listing))
    listingItemRepo = module.get(getRepositoryToken(ListingItem))
    storage = module.get(StorageService)

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


    xit('should create new draft', async () => {
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

    xit('should publish', async () => {
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



    });

    it('should takedown listing', async () => {
      let existing = {
        ...mockListing,
        status: ListingStatus.PUBLISHED,
        visibility: Visibility.PUBLIC
      }

      listingRepo.findOneBy.mockResolvedValueOnce(existing);

      listingRepo.findOneBy.mockResolvedValueOnce(existing);

      const result = await service.takedownListing("1", existing.id)

      expect(listingRepo.update).toHaveBeenCalledWith({ id: existing.id }, expect.anything())
      expect(result).toEqual({
        ...existing,
        status: ListingStatus.UNLISTED,
        visibility: Visibility.DRAFT,
        archivedAt: expect.anything()
      })

    })

    it('should mark draft for deletion', async () => {
      let existing = {
        ...mockListing,
        visibility: Visibility.DRAFT,
        status: ListingStatus.UNLISTED
      }

      listingRepo.findOneByOrFail.mockResolvedValueOnce(existing);
      listingRepo.findOneBy.mockResolvedValueOnce(existing);

      await service.deleteDraft(existing.ownerId, existing.id);

      expect(listingRepo.update).toHaveBeenCalledWith({ id: existing.id }, { status: ListingStatus.DELETED })

      expect(eventEmitter.emit).toHaveBeenCalledWith(ListingEvents.REMOVED, expect.any(ListingDeleteEvent))

    });

    describe('process deletion', () => {

      it('throws when listing does not exist', async () => {
        listingRepo.findOneBy.mockResolvedValue(null);

        await expect(service.processDeletion('id123'))
          .rejects.toThrow('Listing not found');
      });

      it('throws when listing is not marked DELETED', async () => {
        listingRepo.findOneBy.mockResolvedValue({
          id: 'id123',
          status: 'ACTIVE',
        });

        await expect(service.processDeletion('id123'))
          .rejects.toThrow('Listing is not marked for deletion');
      });

      it('deletes blobs and soft-deletes items', async () => {
        listingRepo.findOneBy.mockResolvedValue({
          id: 'id123',
          status: 'DELETED',
        });

        listingItemRepo.findBy.mockResolvedValue([
          { id: 'i1', blobKey: 'folder/name.jpg' },
          { id: 'i2', blobKey: null }, // skip
        ]);

        storage.splitKey.mockReturnValue({
          folder: 'folder',
          name: 'name.jpg',
        });

        await service.processDeletion('id123');

        expect(storage.splitKey).toHaveBeenCalledWith('folder/name.jpg');
        expect(storage.delete).toHaveBeenCalledWith({
          folderPath: 'folder',
          filename: 'name.jpg',
        });

        expect(listingItemRepo.softDelete).toHaveBeenCalledWith({ id: 'i1' });
        expect(listingItemRepo.softDelete).not.toHaveBeenCalledWith({ id: 'i2' });
      });

      it('soft-deletes the listing', async () => {
        listingRepo.findOneBy.mockResolvedValue({
          id: 'id123',
          status: 'DELETED',
        });

        listingItemRepo.findBy.mockResolvedValue([]);

        await service.processDeletion('id123');

        expect(listingRepo.softDelete).toHaveBeenCalledWith({ id: 'id123' });
      });
    })


  })


})
