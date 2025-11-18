import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { TokenLedger } from "../entities/token-ledger.entity";
import { LedgerException, LedgerExceptionCode } from "../ledger.exception";
import { TokenLedgerReferenceType, TokenLedgerType } from "@athena/types";

export class LedgerService {
  constructor(
    @InjectRepository(TokenLedger) private repo: Repository<TokenLedger>) { }


  private async createEntry(data: DeepPartial<TokenLedger>) {
    return this.repo.save(data)
  }

  async assertBalace(walletId: string, amount: number) {
    const balance = await this.getBalance(walletId);
    if (balance < amount)
      throw new LedgerException("Insufficient Balance", LedgerExceptionCode.INSUFFICIENT_BALANCE)
  }


  async getBalance(walletId: string) {
    /**
     * TODO: Apply precomputed strategy for computation savings
      */
    const { sum } = await this.repo.createQueryBuilder("l")
      .select(`SUM(l.amount)`, 'sum')
      .where('l.walletId = :walletId', { walletId })
      .getRawOne();
    return Number(sum) || 0;
  }


  async transfer(fromWalletId: string, toWalletId: string, amount: number, refType: TokenLedgerReferenceType, refId: string, type: TokenLedgerType) {
    if (amount <= 0) throw new LedgerException("Amount of transfer must be positive", LedgerExceptionCode.TRANSFER_AMOUNT_NEGATIVE);

    await this.assertBalace(fromWalletId, amount);

    await this.createEntry({
      amount: -amount,
      walletId: fromWalletId,
      type: type,
      referenceType: refType,
      referenceId: refId
      ,

    })

    await this.createEntry({
      amount: amount,
      walletId: toWalletId,
      type: type,
      referenceId: refId,
      referenceType: refType
    })

  }
}
