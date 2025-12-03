import { Query } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class FetchListingQuery extends Query<Partial<Listing>> {
  constructor(public readonly listingId: string) { super() }
}
