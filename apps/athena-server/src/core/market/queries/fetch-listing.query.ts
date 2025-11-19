import { Listing } from "@athena/types";
import { Query } from "@nestjs/cqrs";

export class FetchListingQuery extends Query<Listing> {
  constructor(
    public readonly listingId: string
  ) {
    super()
  }
}
