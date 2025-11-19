import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Listing } from "../../entities/listing.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FileUploadedEvent } from "src/engine/storage/events/file-uploaded.event";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { StorageEvents } from "src/engine/storage/enums/storage-events.enum";
import { StorageDomain, StorageKeyService } from "src/engine/storage/services/storage-key.service";
import { ListingException, ListingExceptionCode } from "../../exceptions/listing.exception";
import { ListingItem } from "../../entities/listing-item.entity";
import { ListingEvents } from "../../enums/listing-events.enum";
import { ListingItemReadyEvent } from "../listing-item-ready.event";
import { ListingStatus } from "@athena/types";


@Injectable()
export class ListingStorageSubscriber {

  constructor(
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>,
    @InjectRepository(ListingItem) private readonly listingItemRepo: Repository<ListingItem>,
    private readonly key: StorageKeyService,
    private readonly eventEmitter: EventEmitter2
  ) { }


  @OnEvent(StorageEvents.FILE_UPLOADED)
  async handleListingItem(event: FileUploadedEvent) {


    const { key } = event.payload;

    const keyComponents = this.key.splitKey(key);

    if (!key.includes(`/${StorageDomain.LISTING}/`)) return;

    const theListing = await this.listingRepo.preload({ id: keyComponents.ownerId });

    if (!theListing)
      throw new ListingException("No listing found to handle item", ListingExceptionCode.LISTING_NOT_EXIST);

    const theItem = this.listingItemRepo.create({
      listingId: theListing.id,
      blobKey: key,
      title: keyComponents.filename

    })

    await this.listingItemRepo.save(theItem);

    theListing.status = ListingStatus.PROCESSING

    theListing.itemsProcessedCount += 1;

    if (theListing.itemsExpectedCount == theListing.itemsProcessedCount) {
      theListing.status = ListingStatus.READY
    }

    await this.listingRepo.save(theListing);

    this.eventEmitter.emit(
      ListingEvents.ITEM_READY,
      new ListingItemReadyEvent(theListing.id, theItem.id)
    )

  }


}
