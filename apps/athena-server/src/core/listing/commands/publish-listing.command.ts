import { Command } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class PublishListingCommand extends Command<{ listing: Partial<Listing> }> {
  constructor(
    public readonly userId: string,
    public readonly listingId: string
  ) { super() }
}
