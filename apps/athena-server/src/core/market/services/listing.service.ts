import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, DeepPartial } from "typeorm";
import { Listing } from "../entities/listing.entity";
import { ListingItem } from "../entities/listing-item.entity";
import { ContentTypes, Currency, License, ListingStatus, Visibility } from "@athena/types";
import { ListingException, ListingExceptionCode } from "../exceptions/listing.exception";
import { ImageAsNoteService } from "src/core/note/services/image-as-note.service";
import { StorageService } from "src/engine/storage/services/storage.service";
import { StorageDomain, StorageKeyService, StoragePurpose } from "src/engine/storage/services/storage-key.service";
import { resolveFileExtension } from "src/engine/storage/utils/resolve-file-extension.util";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ListingEvents } from "../enums/listing-events.enum";
import { ListingUpdatedEvent } from "../events/listing-updated.event";
import { ListingPublishedEvent } from "../events/listing-published.event";

@Injectable()
export class ListingService {

  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
    private readonly storageService: StorageService,
    private readonly storageKeyService: StorageKeyService,
    private readonly eventEmitter: EventEmitter2) { }

  createListItem(blobKey: string, listingId: string) {
    return this.datasource.manager.create(ListingItem, { listingId: listingId, blobKey: blobKey })

  }


  async ensureUserOwnsListing(userId: string, listingId: string) {
    const found = await this.datasource.manager.findOneBy(Listing, { id: listingId })
    if (found?.sellerId != userId)
      throw new ListingException("Listing and User not match", ListingExceptionCode.LISTING_UNAUTHORIZED, "User do not own this Listing", HttpStatus.UNAUTHORIZED)
  }

  async ensureDraft(listingId: string) {
    const found = await this.datasource.manager.findOneBy(Listing, { id: listingId })
    if (found?.status != ListingStatus.DRAFT || found.visibility !== Visibility.DRAFT)
      throw new ListingException("Cannot edit publised draft", ListingExceptionCode.LISTING_ALREADY_PUBLISHED, "Cannot update Listing that is not in draft state", HttpStatus.BAD_REQUEST)
  }


  async draftListing(payload: DeepPartial<Listing>): Promise<Listing> {
    return this.datasource.manager.save(Listing, {
      ...payload,
      visibility: Visibility.DRAFT,
      status: ListingStatus.DRAFT,
    });
  }

  async updateDraft(listingId: string, payload: DeepPartial<Omit<Listing, "id">>): Promise<Partial<Listing>> {
    payload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
    );
    console.log("updating draft", listingId)
    await this.datasource.manager.update(Listing, listingId, payload)

    this.eventEmitter.emit(ListingEvents.UPDATED, new ListingUpdatedEvent(listingId));

    return await this.datasource.manager.findOneBy(Listing, { id: listingId }) as Partial<Listing>
  }

  async publishListing(listingId: string) {
    const listing = await this.datasource.manager.findOneBy(Listing, { id: listingId })
    console.log(listing, listingId)
    if (!listing)
      throw new ListingException("Listing not found", ListingExceptionCode.LISTING_NOT_EXIST, `Listing ${listingId} not exist`, HttpStatus.BAD_REQUEST)
    if (listing?.visibility != Visibility.DRAFT)
      throw new ListingException(`Cannot publish listing, may be already published`, ListingExceptionCode.LISTING_ALREADY_PUBLISHED, "Listing already published", HttpStatus.BAD_REQUEST);


    if (listing.status != ListingStatus.READY)
      throw new ListingException("Listing is not in ready state for publishing", ListingExceptionCode.LISTING_NOT_READY, 'Listing is not ready, cannot publish for now', HttpStatus.BAD_REQUEST)
    listing.visibility = Visibility.PUBLIC;
    listing.status = ListingStatus.PUBLISHED
    listing.publishedAt = new Date().toISOString();



    const saved = await this.datasource.manager.save(Listing, listing)

    this.eventEmitter.emit(ListingEvents.PUBLISHED, new ListingPublishedEvent(listingId));
    return saved;
  }


  async uploadFileForListing(params: {
    listingId: string,
    mimeType: ContentTypes,
    size: number,
    originalFilename?: string
  }): Promise<{
    key: string,
    url: string
  }> {

    const key = this.storageKeyService.create({
      ownerId: params.listingId,
      domain: StorageDomain.LISTING,
      extension: resolveFileExtension(params.mimeType),
      purpose: StoragePurpose.UPLOADS
    })

    const url = await this.storageService.getUrl({
      key: key,
      contentType: params.mimeType,
      signed: true
    })

    return { key, url }


  }




}
