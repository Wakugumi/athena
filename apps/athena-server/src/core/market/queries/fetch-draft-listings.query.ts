import { Query } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class FetchDraftListingsQuery extends Query<Listing[]> {
  constructor(
    public readonly userId: string
  ) {

    super()
  }

}
