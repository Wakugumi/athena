import { Query } from "@nestjs/cqrs";
import { Listing } from "../entities/listing.entity";
import { PagingOptionsDto } from "src/common/dtos/paging-options.dto";
import { Paginated } from "@athena/types";

export class SearchListingQuery extends Query<Paginated<Listing>> {
  constructor(
    public readonly paging: PagingOptionsDto,
    public readonly title?: string,
    public readonly seller?: string,
    public readonly minPrice?: number,
    public readonly maxPrice?: number,


  ) {
    super();
  }

}
