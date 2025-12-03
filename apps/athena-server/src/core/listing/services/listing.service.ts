import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Listing } from "../entities/listing.entity";
import { ContentTypes, ListingStatus, NotificationCategory, UploadInstruction, Visibility } from "@athena/types";
import { ListingException, ListingExceptionCode } from "../listing.exception";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { ListingEvents } from "../enums/listing-events.enum";
import { ListingUpdatedEvent } from "../events/listing-updated.event";
import { ListingPublishedEvent } from "../events/listing-published.event";
import { UploadService } from "src/engine/storage/services/upload.service";
import { UploadDomain } from "src/engine/storage/enums/upload-domain.enum";
import { UploadPurpose } from "src/engine/storage/enums/upload-purpose.enum";
import { ListingItem } from "../entities/listing-item.entity";
import { ListingDeleteEvent } from "../events/listing-delete.event";
import { StorageService } from "src/engine/storage/services/storage.service";
import { NotificationEvent } from "src/engine/notification/types/notification.constants";
import { NotificationEventPayload } from "src/engine/notification/types/notification.types";

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name)

  constructor(
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>,
    @InjectRepository(ListingItem) private readonly listingItemRepo: Repository<ListingItem>,
    private readonly uploadService: UploadService,
    private readonly eventEmitter: EventEmitter2,
    private readonly storageService: StorageService) { }



  async ensureUserOwnsListing(userId: string, listingId: string) {
    const found = await this.listingRepo.findOneBy({ id: listingId })
    if (found?.ownerId != userId)
      throw new ListingException("Listing and User not match", ListingExceptionCode.LISTING_UNAUTHORIZED, "User do not own this Listing", HttpStatus.UNAUTHORIZED)


    return;
  }

  async ensureDraft(listingId: string) {
    const found = await this.listingRepo.findOneByOrFail({ id: listingId })
    if (found.visibility !== Visibility.DRAFT)
      throw new ListingException("Listing is not in draft state", ListingExceptionCode.LISTING_ALREADY_PUBLISHED, "Cannot update Listing that is not in draft state", HttpStatus.BAD_REQUEST)


    return;
  }


  async draftListing(payload: DeepPartial<Listing>): Promise<Listing> {
    return await this.listingRepo.manager.transaction(async (x) => {
      const max = await x
        .createQueryBuilder(Listing, 'i')
        .setLock('pessimistic_write')
        .where('i.ownerId = :ownerId', { ownerId: payload.ownerId })
        .orderBy('i.number', 'DESC')
        .limit(1)
        .getOne();
      const next = (max?.number ?? 0) + 1;
      const newListing = await x.save(Listing, {
        ...payload,
        title: `New Draft ${next}`,
        visibility: Visibility.DRAFT,
        status: ListingStatus.DRAFT,
        number: next
      })

      this.eventEmitter.emit(NotificationEvent.FIRE, new NotificationEventPayload(payload.ownerId!, NotificationCategory.LISTING, `New draft [${newListing.title}] created`))
      return newListing
    });

  }

  async updateDraft(listingId: string, payload: DeepPartial<Omit<Listing, "id">>): Promise<Partial<Listing>> {
    payload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );

    await this.ensureDraft(listingId)

    await this.listingRepo.update(listingId, payload)

    this.eventEmitter.emit(ListingEvents.UPDATED, new ListingUpdatedEvent(listingId));

    return await this.listingRepo.findOneBy({ id: listingId }) as Partial<Listing>
  }

  async publishListing(listingId: string) {
    const listing = await this.listingRepo.findOneBy({ id: listingId })
    if (!listing)
      throw new ListingException("Listing not found", ListingExceptionCode.LISTING_NOT_EXIST, `Listing ${listingId} not exist`, HttpStatus.BAD_REQUEST)
    if (listing?.visibility !== Visibility.DRAFT)
      throw new ListingException(`Cannot publish listing, may be already published`, ListingExceptionCode.LISTING_ALREADY_PUBLISHED, "Listing already published", HttpStatus.BAD_REQUEST);


    if (listing.status !== ListingStatus.READY)
      throw new ListingException("Listing is not in ready state for publishing", ListingExceptionCode.LISTING_NOT_READY, 'Listing is not ready, cannot publish for now', HttpStatus.BAD_REQUEST)

    listing.visibility = Visibility.PUBLIC;
    listing.status = ListingStatus.PUBLISHED
    listing.publishedAt = new Date().toISOString();

    const saved = await this.listingRepo.save(listing);

    this.eventEmitter.emit(ListingEvents.PUBLISHED, new ListingPublishedEvent(listingId));
    this.eventEmitter.emit(NotificationEvent.FIRE, new NotificationEventPayload(listing.ownerId, NotificationCategory.LISTING, `[${listing.title}] is now public`));
    return saved;
  }


  async uploadFileForListing(params: {
    listingId: string,
    mimeType: ContentTypes,
  }): Promise<UploadInstruction> {
    const theListing = await this.listingRepo.findOneByOrFail({ id: params.listingId })


    const upload = await this.uploadService.createUpload({
      referenceId: theListing.id,
      contentType: params.mimeType,
      domain: UploadDomain.LISTING,
      purpose: UploadPurpose.UPLOADS
    })

    return upload


  }

  async markItemReady(listingId: string) {

    const theListing = await this.listingRepo.findOneBy({ id: listingId })
    if (!theListing)
      throw new ListingException("Abort event handlers, no Listing found", ListingExceptionCode.LISTING_NOT_EXIST);



    const sum = await this.listingItemRepo.createQueryBuilder('c')
      .where('c.listingId = :id', { id: listingId })
      .andWhere('c.status = :status', { status: 'READY' })
      .getCount();

    theListing.itemsProcessedCount = Number(sum)


    if (theListing.itemsProcessedCount == theListing.itemsExpectedCount) {
      theListing.status = ListingStatus.READY

    }
    await this.listingRepo.save(theListing);

  }

  async takedownListing(userId: string, listingId: string): Promise<Listing> {

    const listing = await this.listingRepo.findOneBy({ id: listingId });

    if (!listing)
      throw new ListingException("Listing not found", ListingExceptionCode.LISTING_NOT_EXIST, "No listing found to be taken down", HttpStatus.NOT_FOUND);

    await this.ensureUserOwnsListing(userId, listingId);

    if (listing.status !== ListingStatus.PUBLISHED || listing.visibility === Visibility.DRAFT)
      throw new ListingException("Listing is not published to be taken down", ListingExceptionCode.LISTING_NOT_PUBLISHED, "Can only take down published listing", HttpStatus.BAD_REQUEST)

    listing.status = ListingStatus.UNLISTED;
    listing.visibility = Visibility.DRAFT;
    listing.archivedAt = new Date().toUTCString()

    await this.listingRepo.update({ id: listingId }, listing);


    this.eventEmitter.emit(NotificationEvent.FIRE, new NotificationEventPayload(userId, NotificationCategory.LISTING, `Your listing [${listing.title}] has been unlisted`))

    return listing;

  }


  async deleteDraft(userId: string, listingId: string) {
    await this.ensureDraft(listingId);
    await this.ensureUserOwnsListing(userId, listingId);
    const listing = await this.listingRepo.findOneBy({ id: listingId })

    await this.listingRepo.update({ id: listingId }, { status: ListingStatus.DELETED })

    this.eventEmitter.emit(ListingEvents.REMOVED, new ListingDeleteEvent(listingId))

    this.eventEmitter.emit(NotificationEvent.FIRE, new NotificationEventPayload(userId, NotificationCategory.LISTING, `Your draft [${listing?.title}] has been deleted`))

  }

  /**
  * Processing Listing marked for deletion.
  * Remove items and permanently deleting assoicated blobs
  */
  async processDeletion(listingId: string) {

    const listing = await this.listingRepo.findOneBy({ id: listingId })
    if (!listing)
      throw new ListingException("Listing not found", ListingExceptionCode.LISTING_NOT_EXIST);
    if (listing.status !== ListingStatus.DELETED)
      throw new ListingException("Listing is not marked for deletion", ListingExceptionCode.LISTING_FALSE_MARK)


    const items: ListingItem[] = await this.listingItemRepo.findBy({ listingId: listingId });


    items.forEach(async item => {
      if (!item.blobKey) return
      const { folder, name } = this.storageService.splitKey(item.blobKey)
      await this.storageService.delete({ folderPath: folder, filename: name })
      await this.listingItemRepo.softDelete({ id: item.id })
    })

    await this.listingRepo.softDelete({ id: listingId });
    this.logger.debug(`finale deletion of listing - ${listingId}`)
  }




}
