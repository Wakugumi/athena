import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "../entities/wallet.entity";
import { Repository } from "typeorm";
import { TokenLedger } from "../entities/token-ledger.entity";
import { FindWalletLedgersDTO } from "../dtos/wallet-history.input";
import { query } from "express";
import { WalletException, WalletExceptionCode } from "../wallet.exception";
import { WalletOwnerType } from "@athena/types";
import { User } from "src/core/user/user.entity";
import { Order } from "src/core/market/entities/order.entity";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(TokenLedger) private readonly ledgerRepo: Repository<TokenLedger>,
    @InjectRepository(User) private readonly userRepo: Repository<User>
    ,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>
  ) { }

  async resolveOwner(wallet: Wallet) {
    switch (wallet.ownerType) {
      case WalletOwnerType.USER:
        return this.userRepo.findOneBy({ id: wallet.ownerId })

      case WalletOwnerType.ESCROW:
        return this.orderRepo.findOneBy({ id: wallet.ownerId })

      default:
        return null
    }
  }

  // Queries
  async getWalletByUser(userId: string) {
    return this.walletRepo.findOneBy({
      ownerId: userId,
      ownerType: WalletOwnerType.USER
    });
  }

  async getEscrowWallet(orderId: string) {
    return this.walletRepo.findOneBy({
      ownerId: orderId,
      ownerType: WalletOwnerType.ESCROW
    })
  }

  async getWalletHistory(walletId: string, queries: FindWalletLedgersDTO) {
    const qb = this.ledgerRepo.createQueryBuilder();

    qb.andWhere('token_ledger.walletId = :id', { id: queries.walletId })

    if (queries.dateFrom) {
      qb.andWhere('token_ledger.createdAt >= :date', { date: queries.dateFrom })
    }

    if (queries.dateTo) qb.andWhere('token_ledger.createdAt <= :date', { date: queries.dateTo })

    return qb.getMany()

  }

  // Commands
  async createWallet(ownerId: string, ownerType: WalletOwnerType) {

    if (await this.walletRepo.exists({ where: { ownerId: ownerId } })) {
      throw new WalletException("Cannot create more than one wallet", WalletExceptionCode.WALLET_ALREADY_HAVE, "User already have a wallet, cannot create again", HttpStatus.BAD_REQUEST)

    }

    const newWallet = this.walletRepo.create({
      ownerId: ownerId,
      ownerType: ownerType
    })

    return this.walletRepo.save(newWallet);
  }


}
