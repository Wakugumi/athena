import { Query } from "@nestjs/cqrs"
import { Wallet } from "../entities/wallet.entity"

export class FetchWalletQuery extends Query<Wallet> {
  constructor(
    public readonly userId: string
  ) {
    super();
  }
}
