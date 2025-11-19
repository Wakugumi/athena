import { Listing } from "@athena/types";
import { Query } from "@nestjs/cqrs";

/**
 * Fetch a single listing.
 * Optimized for detailed information.
 * Only accept published listing
 *
 */
export class FetchListingQuery extends Query<Listing> {
  constructor(
    public readonly listingId: string
  ) {
    super()
  }
}
