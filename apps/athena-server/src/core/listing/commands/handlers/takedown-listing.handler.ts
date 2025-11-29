import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TakedownListingCommand } from "../takedown-listing.command";
import { ListingService } from "../../services/listing.service";
import { Listing } from "../../entities/listing.entity";

@CommandHandler(TakedownListingCommand)
export class TakedownListingHandler implements ICommandHandler<TakedownListingCommand> {

  constructor(private readonly listingService: ListingService) {

  }


  async execute(command: TakedownListingCommand): Promise<Listing> {
    return await this.listingService.takedownListing(command.userId, command.listingId)

  }

}
