import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FetchListingQuery } from "../fetch-listing.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Listing } from "../../entities/listing.entity";
import { Repository } from "typeorm";
import { ListingStatus, Visibility } from "@athena/types";

@QueryHandler(FetchListingQuery)
export class FetchListingHandler implements IQueryHandler<FetchListingQuery> {

  constructor(
    @InjectRepository(Listing) private readonly repo: Repository<Listing>
  ) { }


  async execute(query: FetchListingQuery): Promise<Partial<Listing>> {

    const qb = this.repo.createQueryBuilder('l');
    qb.where('l.id = :id', { id: query.listingId })
    qb.leftJoin('l.owner', 'owner').addSelect(['owner.id', 'owner.displayName', 'owner.avatar', 'owner.bio', 'owner.username'])

    return qb.getOneOrFail()

  }

}


