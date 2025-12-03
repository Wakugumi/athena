import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FetchDraftQuery } from "../fetch-draft.query";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Listing } from "../../entities/listing.entity";
import { Visibility } from "@athena/types";
import { ListingService } from "../../services/listing.service";

@QueryHandler(FetchDraftQuery)
export class FetchDraftHandler implements IQueryHandler<FetchDraftQuery> {
  constructor(@InjectRepository(Listing) private readonly repo: Repository<Listing>, private service: ListingService) { }

  async execute(query: FetchDraftQuery): Promise<Partial<Listing>> {

    const qb = this.repo.createQueryBuilder('l');
    qb.where('l.id = :id', { id: query.listingId })
    qb.andWhere('l.ownerId = :uid', { uid: query.userId })
    qb.leftJoin('l.owner', 'owner').addSelect(['owner.id', 'owner.displayName', 'owner.avatar', 'owner.bio', 'owner.username'])
    qb.leftJoinAndSelect('l.items', 'items')

    return qb.getOneOrFail()

  }

}
