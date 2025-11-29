import { Command } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class UpdateDraftListingCommand extends Command<Partial<Listing>> {
  constructor(
    public readonly listingId: string,
    public readonly userId: string,
    public readonly payload: Partial<Omit<Listing, "id" | "sellerId" | "visibility">>

  ) {
    super();
  }
}
