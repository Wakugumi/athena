import { Command } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

/**
 * Turn published listing down into draft state
  */
export class TakedownListingCommand extends Command<Listing> {


  constructor(
    public readonly userId: string,
    public readonly listingId: string

  ) { super() }

}
