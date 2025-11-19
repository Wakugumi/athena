import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchListingQuery } from "../queries/search-listing.query";
import { Listing } from "../entities/listing.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ListingStatus, Visibility } from "@athena/types";

@QueryHandler(SearchListingQuery)
export class SearchListingHandler implements IQueryHandler<SearchListingQuery> {

  constructor(@InjectRepository(Listing) private readonly listingRepo: Repository<Listing>) {
  }



  async execute(query: SearchListingQuery): Promise<Listing[]> {
    const q = this.listingRepo.createQueryBuilder('x');
    q.andWhere('x.status = :status', { status: ListingStatus.PUBLISHED });
    q.andWhere('x.visibility = :visibility', { visibility: Visibility.PUBLIC });


    if (query.title)
      q.andWhere('x.title ILIKE :title', { title: `${query.title}` });

    if (query.minPrice)
      q.andWhere('x.price >= :minPrice', { minPrice: query.minPrice })

    if (query.maxPrice)
      q.andWhere('x.price <= :maxPrice', { maxPrice: query.maxPrice })

    if (query.seller) {
      const cols = ['username', 'firstName', 'lastName'];
      q.leftJoin('x.seller', 'seller')
      q.andWhere(
        cols.map(col => `seller.${col} ILIKE :q`)
          .join(' OR '),
        { q: `%${query.seller}%` }
      )

    }


    q.leftJoinAndSelect('x.seller', 'seller');


    return await q.getMany()

  }
}
