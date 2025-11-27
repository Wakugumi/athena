import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { Listing } from "../../entities/listing.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { StorageEvents } from "src/engine/storage/enums/storage-events.enum";
import { StorageKeyService } from "src/engine/storage/services/storage-key.service";
import { ListingItem } from "../../entities/listing-item.entity";
import { ListingEvents } from "../../enums/listing-events.enum";
import { ListingItemReadyEvent } from "../listing-item-ready.event";
import { StorageProcessingService } from "src/engine/storage/services/storage-processing.service";
import { StorageService } from "src/engine/storage/services/storage.service";
import { FileUploadedEvent } from "src/engine/storage/events/file-uploaded.event";
import { UploadService } from "src/engine/storage/services/upload.service";
import { UploadDomain } from "src/engine/storage/enums/upload-domain.enum";
import { UploadPurpose } from "src/engine/storage/enums/upload-purpose.enum";


@Injectable()
export class ListingStorageSubscriber {
  private logger = new Logger(ListingStorageSubscriber.name)

  constructor(
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>,
    @InjectRepository(ListingItem) private readonly listingItemRepo: Repository<ListingItem>,
    private readonly key: StorageKeyService,
    private readonly eventEmitter: EventEmitter2,
    private readonly storageProcessing: StorageProcessingService,
    private readonly storage: StorageService,
    private readonly uploadService: UploadService
  ) { }


  @OnEvent(StorageEvents.FILE_UPLOADED)
  async handleListingItem(event: FileUploadedEvent) {

    if (event.domain !== UploadDomain.LISTING || event.purpose !== UploadPurpose.UPLOADS) return;

    this.logger.log(`Handling Listing Upload Event ${event.uploadId}`)


    const upload = await this.uploadService.lookupJob(event.uploadId);

    const theListing = await this.listingRepo.findOneByOrFail({ id: upload.referenceId })

    theListing.itemsExpectedCount += 1


    let { key } = upload;

    // const keyComponents = this.key.splitKey(key);

    let preview = '**Preview**'


    // if the blob's key extension represent media file
    if (key.match(/\.(png|jpg|jpeg|gif)$/)) {

      key = await this.storageProcessing.convertImageToMarkdown(key)

      preview = `![${key}](${this.storage.getUrl({ key: key })})`;
    }

    preview = await this.storageProcessing.generatePreview(key)


    this.logger.log(`saving listing item record ${upload.id} ${upload.key}`)

    const newItem = await this.listingItemRepo.save({
      id: upload.id,
      listingId: upload.referenceId,
      title: upload.key
    })

    this.logger.log("Saved new Listing Item record", newItem.id)

    await this.listingItemRepo.update({ id: newItem.id }, { status: "READY", preview: preview, blobKey: key })

    theListing.preview = preview;
    theListing.summary = preview;

    await this.listingRepo.save(theListing)

    this.eventEmitter.emit(
      ListingEvents.ITEM_READY,
      new ListingItemReadyEvent(newItem.listingId, newItem.id)
    )

  }


}
