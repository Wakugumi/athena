import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Listing } from "../entities/listing.entity";
import { ContentTypes, ListingStatus, Visibility } from "@athena/types";
import { ListingException, ListingExceptionCode } from "../listing.exception";
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
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>,
    private readonly storageService: StorageService,
    private readonly storageKeyService: StorageKeyService,
    private readonly eventEmitter: EventEmitter2) { }


  async ensureUserOwnsListing(userId: string, listingId: string) {
    const found = await this.listingRepo.findOneBy({ id: listingId })
    if (found?.ownerId != userId)
      throw new ListingException("Listing and User not match", ListingExceptionCode.LISTING_UNAUTHORIZED, "User do not own this Listing", HttpStatus.UNAUTHORIZED)


    return;
  }

  async ensureDraft(listingId: string) {
    const found = await this.listingRepo.findOneBy({ id: listingId })
    if (found?.status != ListingStatus.DRAFT || found.visibility !== Visibility.DRAFT)
      throw new ListingException("Cannot edit publised draft", ListingExceptionCode.LISTING_ALREADY_PUBLISHED, "Cannot update Listing that is not in draft state", HttpStatus.BAD_REQUEST)


    return;
  }


  async draftListing(payload: DeepPartial<Listing>): Promise<Listing> {
    return this.listingRepo.save({
      ...payload,
      visibility: Visibility.DRAFT,
      status: ListingStatus.DRAFT,
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

    const saved = await this.listingRepo.save(listing)

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
