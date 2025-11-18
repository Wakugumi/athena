import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./entities/wallet.entity";
import { WalletTriggerInitService } from "./services/wallet-trigger-init.service";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [WalletTriggerInitService],
  exports: [TypeOrmModule]
})
export class WalletModule {

}
