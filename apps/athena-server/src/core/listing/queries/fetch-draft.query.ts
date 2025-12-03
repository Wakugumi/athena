import { Query } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class FetchDraftQuery extends Query<Partial<Listing>> {
  constructor(public readonly listingId: string, public readonly userId: string) { super() }
}
