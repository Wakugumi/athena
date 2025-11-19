import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PublishListingCommand } from "../commands/publish-listing.command";
import { Listing } from "../entities/listing.entity";
import { ListingService } from "../services/listing.service";

@CommandHandler(PublishListingCommand)
export class PublishListingHandler implements ICommandHandler<PublishListingCommand> {

  constructor(private readonly listingService: ListingService) {

  }


  async execute(command: PublishListingCommand): Promise<{ listing: Partial<Listing>; }> {
    await this.listingService.ensureUserOwnsListing(command.userId, command.listingId)


    console.log("publish listing", command.listingId)
    const listing = await this.listingService.publishListing(command.listingId);



    return {
      listing: listing
    }


  }

}
