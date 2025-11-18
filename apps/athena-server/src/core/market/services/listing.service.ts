import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, DeepPartial } from "typeorm";
import { Listing, ListingStatus } from "../entities/listing.entity";
import { ListingItem } from "../entities/listing-item.entity";
import { ContentTypes, Currency, License, Visibility } from "@athena/types";
import { ListingException, ListingExceptionCode } from "../exceptions/listing.exception";
import { ImageAsNoteService } from "src/core/note/services/image-as-note.service";
import { StorageService } from "src/engine/storage/services/storage.service";
import { StorageDomain, StorageKeyService, StoragePurpose } from "src/engine/storage/services/storage-key.service";
import { resolveFileExtension } from "src/engine/storage/utils/resolve-file-extension.util";
import { SigedUrlPermission } from "src/engine/storage/types/storage-driver.interface";

@Injectable()
export class ListingService {

  constructor(private readonly imageAsNoteService: ImageAsNoteService,
    @InjectDataSource() private readonly datasource: DataSource,
    private readonly storageService: StorageService,
    private readonly storageKeyService: StorageKeyService) { }

  createListItem(blobKey: string, listingId: string) {
    return this.datasource.manager.create(ListingItem, { listingId: listingId, blobKey: blobKey })

  }


  async ensureUserOwnsListing(userId: string, listingId: string) {
    await this.datasource.manager.findOneByOrFail(Listing, { id: listingId, sellerId: userId })
  }


  async draftListing(payload: DeepPartial<Listing>): Promise<Listing> {
    return this.datasource.manager.save(Listing, {
      ...payload,
      visibility: Visibility.DRAFT,
      status: ListingStatus.DRAFT
    });
  }

  async publishListing(listingId: string) {
    const listing = await this.datasource.manager.preload(Listing, { id: listingId })
    if (!listing)
      throw new ListingException("Listing not found", ListingExceptionCode.LISTING_NOT_EXIST, `Listing ${listingId} not exist`, HttpStatus.BAD_REQUEST)
    if (listing?.visibility != Visibility.DRAFT)
      throw new ListingException(`Cannot publish listing, may be already published`, ListingExceptionCode.LISTING_ALREADY_PUBLISHED, "Listing already published", HttpStatus.BAD_REQUEST);


    if (listing.status != ListingStatus.READY)
      throw new ListingException("Listing is not in ready state for publishing", ListingExceptionCode.LISTING_NOT_READY, 'Listing is still in processing, cannot publish for now', HttpStatus.BAD_REQUEST)
    listing.visibility = Visibility.PUBLIC;
    listing.publishedAt = new Date().toISOString();
    return await this.datasource.manager.save(Listing, listing)
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
      permissions: [SigedUrlPermission.WRITE],
      contentType: params.mimeType,

    })

    return { key, url }


  }




}
