import { OnEvent } from "@nestjs/event-emitter";
import { ListingItemReadyEvent } from "../listing-item-ready.event";
import { ListingEvents } from "../../enums/listing-events.enum";
import { Injectable, Logger } from "@nestjs/common";
import { ListingService } from "../../services/listing.service";


@Injectable()
export class ListingSubscriber {
  private readonly logger = new Logger(ListingSubscriber.name)
  constructor(private readonly listingService: ListingService) { }

  @OnEvent(ListingEvents.ITEM_READY)
  async handleItemReady(event: ListingItemReadyEvent) {
    this.logger.log(`Handling Item ready state ${event.listingId} -> ${event.listingItemId}`)

    await this.listingService.markItemReady(event.listingId)


  }


}
