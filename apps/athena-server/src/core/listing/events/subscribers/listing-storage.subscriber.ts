import { Injectable, Logger } from "@nestjs/common";
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
import { StorageUploadEvent } from "src/engine/storage/types/storage-upload-event.type";
import { StorageProcessingService } from "src/engine/storage/services/storage-processing.service";
import { StorageService } from "src/engine/storage/services/storage.service";


@Injectable()
export class ListingStorageSubscriber {
  private logger = new Logger(ListingStorageSubscriber.name)

  constructor(
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>,
    @InjectRepository(ListingItem) private readonly listingItemRepo: Repository<ListingItem>,
    private readonly key: StorageKeyService,
    private readonly eventEmitter: EventEmitter2,
    private readonly storageProcessing: StorageProcessingService,
    private readonly storage: StorageService
  ) { }


  @OnEvent(StorageEvents.FILE_UPLOADED)
  async handleListingItem(event: StorageUploadEvent) {

    this.logger.log(`Handling Listing Upload Event ${event.key}`)

    let { key } = event;

    const keyComponents = this.key.splitKey(key);

    if (!key.includes(`/${StorageDomain.LISTING}/`)) return;

    let preview = '**Preview**'


    if (key.match(/\.(png|jpg|jpeg|gif)$/)) {

      key = await this.storageProcessing.convertImageToMarkdown(event)

      preview = `![${key}](${this.storage.getUrl({ signed: false, key: key })})`;
    }

    preview = await this.storageProcessing.generatePreview(key)


    this.logger.log("Handling Listing Upload Event 2")
    const theListing = await this.listingRepo.preload({ id: keyComponents.ownerId });

    if (!theListing)
      throw new ListingException("No listing found to handle item", ListingExceptionCode.LISTING_NOT_EXIST);





    const theItem = this.listingItemRepo.create({
      listingId: theListing.id,
      blobKey: key,
      title: keyComponents.filename,
      preview: preview


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
