import { Query } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";

export class SearchListingQuery extends Query<Listing[]> {
  constructor(
    public readonly title?: string,
    public readonly seller?: string,
    public readonly minPrice?: number,
    public readonly maxPrice?: number,

  ) {
    super();
  }

}
