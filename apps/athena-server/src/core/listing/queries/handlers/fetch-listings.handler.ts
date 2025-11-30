import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FetchListingsQuery } from "../fetch-listings.query";
import { Listing } from "../../entities/listing.entity";

@QueryHandler(FetchListingsQuery)
export class FetchListingsHandler implements IQueryHandler<FetchListingsQuery> {

  constructor(@InjectRepository(Listing) private readonly repo: Repository<Listing>) { }


  async execute(query: FetchListingsQuery): Promise<Listing[]> {
    const qb = this.repo.createQueryBuilder('l');
    qb.leftJoinAndSelect('l.items', 'item');
    qb.leftJoin('l.owner', 'owner').addSelect(['owner.id', 'owner.displayName', 'owner.avatar', 'owner.bio'])
    if (query.userId)
      qb.andWhere('l.ownerId = :userId', { userId: query.userId });

    if (query.listingId)
      qb.andWhere('l.id = :id', { id: query.listingId })

    if (query.title)
      qb.andWhere('l.title ILIKE :title', { title: query.title })


    if (query.status != undefined)
      qb.andWhere('l.status = :status', { status: query.status })

    if (query.visibility !== undefined)
      qb.andWhere('l.visibility = :visibility', { visibility: query.visibility })



    return qb.getMany()


  }

}
