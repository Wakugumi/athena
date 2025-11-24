import { ICommandHandler } from "@nestjs/cqrs";
import { DraftListingCommand } from "../draft-listing.command";
import { Listing } from "../../entities/listing.entity";
import { ListingService } from "../../services/listing.service";

export class DraftListingHandler implements ICommandHandler<DraftListingCommand> {


  constructor(private readonly listingService: ListingService) {

  }


  async execute(command: DraftListingCommand): Promise<Listing> {
    return await this.listingService.draftListing({
      ownerId: command.userId
    })

  }
}
