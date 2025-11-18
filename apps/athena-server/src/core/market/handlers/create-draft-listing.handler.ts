import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateDraftListingCommand } from "../commands/create-draft-listing.command";
import { Listing } from "../entities/listing.entity";
import { ListingService } from "../services/listing.service";

@CommandHandler(CreateDraftListingCommand)
export class CreateDraftListingHandler implements ICommandHandler<CreateDraftListingCommand> {

  constructor(private readonly listingService: ListingService) { }


  async execute(command: CreateDraftListingCommand): Promise<{ draft: Partial<Listing>; }> {

    const draft = await this.listingService.draftListing({
      sellerId: command.userId,
      title: "Listing Baru"
    })
    return {
      draft: draft as Partial<Listing>
    }

  }


}
