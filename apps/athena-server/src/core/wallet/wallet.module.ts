import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./entities/wallet.entity";
import { WalletTriggerInitService } from "./services/wallet-trigger-init.service";
import { WalletService } from "./services/wallet.service";
import { UserWalletService } from "./services/user-wallet.service";
import { TokenLedger } from "../ledger/entities/token-ledger.entity";
import { UserModule } from "../user/user.module";
import { Order } from "../market/entities/order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, TokenLedger, Order]), UserModule],
  providers: [WalletService, UserWalletService],
  exports: [TypeOrmModule, WalletService, UserWalletService]
})
export class WalletModule {

}
