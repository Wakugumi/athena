import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FetchWalletQuery } from "../queries/fetch-wallet.query";
import { Wallet } from "../entities/wallet.entity";
import { UserWalletService } from "../services/user-wallet.service";

@QueryHandler(FetchWalletQuery)
export class FetchWalletHandler implements IQueryHandler<FetchWalletQuery> {
  constructor(
    private readonly userWalletService: UserWalletService
  ) {

  }

  async execute(query: FetchWalletQuery): Promise<Wallet> {
    return await this.userWalletService.fetchWalletInfo(query.userId);

  }
}
