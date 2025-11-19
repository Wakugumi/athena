import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FetchListingQuery } from "../queries/fetch-listing.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Listing } from "../entities/listing.entity";
import { Repository } from "typeorm";
import { ListingException, ListingExceptionCode } from "../exceptions/listing.exception";
import { HttpStatus } from "@nestjs/common";
import { ListingStatus, Visibility } from "@athena/types";

@QueryHandler(FetchListingHandler)
export class FetchListingHandler implements IQueryHandler<FetchListingQuery> {
  constructor(
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>
  ) {

  }


  async execute(query: FetchListingQuery): Promise<Listing> {

    const listing = await this.listingRepo.findOne({
      where: {
        id: query.listingId
      },
      relations: ['items', "seller", "orders"]
    })

    if (!listing)
      throw new ListingException("No Listing found", ListingExceptionCode.LISTING_NOT_EXIST, "Cannot fetch this product", HttpStatus.NOT_FOUND)

    if (listing.status != ListingStatus.PUBLISHED || listing.visibility == Visibility.DRAFT)
      throw new ListingException("This listing is either private or unpublished", ListingExceptionCode.LISTING_UNAUTHORIZED, "This product is either private or unpublished", HttpStatus.UNAUTHORIZED)

    return listing

  }

}
