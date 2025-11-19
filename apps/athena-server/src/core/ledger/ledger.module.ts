import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenLedger } from "./entities/token-ledger.entity";
import { LedgerService } from "./services/ledger.service";

@Module({
  imports: [TypeOrmModule.forFeature([TokenLedger])],
  providers: [LedgerService],
  exports: [LedgerService]
})
export class LedgerModule {

}
