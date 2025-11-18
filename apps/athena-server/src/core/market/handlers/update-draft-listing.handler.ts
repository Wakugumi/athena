import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateDraftListingCommand } from "../commands/update-draft-listing.command";
import { ListingService } from "../services/listing.service";
import { Listing } from "../entities/listing.entity";

@CommandHandler(UpdateDraftListingCommand)
export class UpdateDraftListingHandler implements ICommandHandler<UpdateDraftListingCommand> {
  constructor(private readonly listingService: ListingService) { }


  async execute(command: UpdateDraftListingCommand): Promise<Partial<Listing>> {
    await this.listingService.ensureUserOwnsListing(command.listingId, command.userId);


    const draft = await this.listingService.draftListing({
      id: command.listingId,
      ...command.payload
    })

    return draft


  }
}
