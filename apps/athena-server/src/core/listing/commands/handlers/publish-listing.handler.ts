import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PublishListingCommand } from "../publish-listing.command";
import { ListingService } from "../../services/listing.service";
import { Listing } from "../../entities/listing.entity";
import { Logger } from "@nestjs/common";

@CommandHandler(PublishListingCommand)
export class PublishListingHandler implements ICommandHandler<PublishListingCommand> {
  private readonly logger = new Logger(PublishListingHandler.name)

  constructor(private readonly listingService: ListingService) {

  }


  async execute(command: PublishListingCommand): Promise<Partial<Listing>> {
    await this.listingService.ensureUserOwnsListing(command.userId, command.listingId)

    const listing = await this.listingService.publishListing(command.listingId);

    this.logger.log("published new listing", 'publish_listing')

    return listing


  }

}
