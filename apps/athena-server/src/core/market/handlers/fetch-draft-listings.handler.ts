import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FetchDraftListingsQuery } from "../queries/fetch-draft-listings.query";
import { Listing } from "../entities/listing.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Visibility } from "@athena/types";

@QueryHandler(FetchDraftListingsQuery)
export class FetchDraftListingsHandler implements IQueryHandler<FetchDraftListingsQuery> {

  constructor(
    @InjectRepository(Listing) private readonly repo: Repository<Listing>
  ) { }
  async execute(query: FetchDraftListingsQuery): Promise<Listing[]> {


    return await this.repo.findBy({
      sellerId: query.userId,
      visibility: Visibility.DRAFT
    });

  }

}
