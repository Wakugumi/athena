import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteDraftListingCommand } from "../delete-draft-listing.command";
import { ListingService } from "../../services/listing.service";


@CommandHandler(DeleteDraftListingCommand)
export class DeleteDraftListingHandler implements ICommandHandler<DeleteDraftListingCommand> {

  constructor(private readonly listingService: ListingService) { }

  async execute(command: DeleteDraftListingCommand): Promise<void> {

    await this.listingService.deleteDraft(command.userId, command.listingId)

  }

}
