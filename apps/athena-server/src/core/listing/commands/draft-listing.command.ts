import { Command } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class DraftListingCommand extends Command<Listing> {

  constructor(
    public readonly userId: string

  ) { super(); }
}
