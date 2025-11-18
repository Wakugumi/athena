import { Command } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class CreateDraftListingCommand extends Command<{ draft: Partial<Listing> }> {
  constructor(
    public readonly userId: string,


  ) { super() }
}
