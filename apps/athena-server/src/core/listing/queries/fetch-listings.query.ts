import { Query } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";
import { ListingStatus, Paginated, PaginationQuery, Visibility } from "@athena/types";
import { PagingOptionsDto } from "src/common/dtos/paging-options.dto";

/**
 * Query current user's listing
  * Not for public usage (auth required)
  */
export class FetchListingsQuery extends Query<Paginated<Listing>> {

  constructor(
    public readonly paging: PagingOptionsDto,
    public readonly userId?: string,
    public readonly listingId?: string,
    public readonly title?: string,
    public readonly visibility?: Visibility,
    public readonly status?: ListingStatus,
  ) {
    super();
  }
}
