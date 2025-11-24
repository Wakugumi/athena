import { Query } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";
import { ListingStatus, Visibility } from "@athena/types";

/**
 * Query current user's listing
  * Not for public usage (auth required)
  */
export class FetchMyListingsQuery extends Query<Listing[]> {

  constructor(
    public readonly userId: string,
    public readonly listingId?: string,
    public readonly title?: string,
    public readonly visibility?: Visibility,
    public readonly status?: ListingStatus,
  ) {
    super();
  }
}
