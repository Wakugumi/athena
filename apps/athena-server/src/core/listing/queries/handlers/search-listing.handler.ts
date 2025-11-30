import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ListingStatus, Visibility } from "@athena/types";
import { Listing } from "src/core/listing/entities/listing.entity";
import { SearchListingQuery } from "../search-listing.query";

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
      q.leftJoin('x.owner', 'owner')
      q.andWhere(
        cols.map(col => `owner.${col} ILIKE :q`)
          .join(' OR '),
        { q: `%${query.seller}%` }
      )

    }

    q.leftJoin('x.owner', 'owner').addSelect(['owner.id', 'owner.displayName', 'owner.avatar', 'owner.bio'])


    return await q.getMany()

  }
}
