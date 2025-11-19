

/**
 * Service for querying user's wallet
 */

import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Wallet } from "../entities/wallet.entity";
import { WalletException, WalletExceptionCode } from "../wallet.exception";
import { LedgerService } from "src/core/ledger/services/ledger.service";

@Injectable()
export class UserWalletService {
  constructor(@InjectRepository(Wallet) private wallet: Repository<Wallet>,
    private readonly ledgerService: LedgerService
  ) { }

  async syncBallance(walletId: string) {
    const balance = await this.ledgerService.getBalance(walletId)
    return await this.wallet.update(walletId, { balance: balance })

  }

  async fetchWalletInfo(userId: string): Promise<Wallet> {

    const wallet = await this.wallet.findOneBy({
      ownerId: userId
    });

    if (!wallet) throw new WalletException('Wallet not found', WalletExceptionCode.WALLET_NOT_EXIST, "This user has no wallet associated", HttpStatus.NOT_FOUND);

    await this.syncBallance(wallet?.id)

    return await this.wallet.findOneBy({ ownerId: userId }) as Wallet

  }
}
