import { Command } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class DeleteDraftListingCommand extends Command<void> {
  constructor(
    public readonly listingId: string,
    public readonly userId: string
  ) { super() }
}
