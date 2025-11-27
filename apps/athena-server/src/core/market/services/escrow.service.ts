import { DataSource } from "typeorm";
import { Escrow } from "../entities/escrow.entity";
import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { EscrowStatus, TokenLedgerReferenceType, TokenLedgerType, WalletOwnerType } from "@athena/types";
import { WalletService } from "src/core/wallet/services/wallet.service";
import { LedgerService } from "src/core/ledger/services/ledger.service";
import { Order } from "../entities/order.entity";

@Injectable()
export class EscrowService {
  constructor(@InjectDataSource() private readonly datasource: DataSource,
    private walletService: WalletService,
    private ledgerService: LedgerService) { }

  async createEscrowWallet(orderId: string) {

    const existing = await this.walletService.getEscrowWallet(orderId)

    if (existing) return existing;

    return this.walletService.createWallet(orderId, WalletOwnerType.ESCROW);

  }

  async holdFunds(buyerId: string, orderId: string, amount: number) {

    const escrowWallet = await this.createEscrowWallet(orderId);
    return this.datasource.transaction(async trx => {
      await this.ledgerService.transfer(buyerId, escrowWallet.id, amount, TokenLedgerReferenceType.ORDER, orderId)

      const escrowRepo = trx.getRepository(Escrow)
      return escrowRepo.save({

        amount: amount,
        orderId: orderId,
        status: EscrowStatus.HELD,
      })


    })
  }

  async releaseFunds(orderId: string, sellerId: string) {
    const escrowWallet = await this.createEscrowWallet(orderId);

    return this.datasource.transaction(async trx => {
      const order = await trx.findOneByOrFail(Order, { id: orderId })
      await this.ledgerService.transfer(escrowWallet.id, sellerId, order.amount, TokenLedgerReferenceType.ORDER, orderId);
      await trx.getRepository(Escrow).update({ orderId: orderId }, { status: EscrowStatus.RELEASED })
    })
  }

  /**
  * Consider the name later, poor choice
  */
  async refundFunds(orderId: string, buyerId: string) {
    const escrowWallet = await this.createEscrowWallet(orderId);

    return this.datasource.transaction(async trx => {
      const order = await trx.findOneByOrFail(Order, { id: orderId })
      await this.ledgerService.transfer(escrowWallet.id, buyerId, order.amount, TokenLedgerReferenceType.REFUND, orderId);
      await trx.getRepository(Escrow).update({ orderId: orderId }, { status: EscrowStatus.REFUNDED })
    })
  }
}
