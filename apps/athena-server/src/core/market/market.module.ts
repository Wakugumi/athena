import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Escrow } from "./entities/escrow.entity";
import { Order } from "./entities/order.entity";
import { EscrowService } from "./services/escrow.service";
import { OrderService } from "./services/order.service";
import { OrderOwnersipService } from "./services/order-ownership.service";
import { CreateOrderHandler } from "./handlers/create-order.handler";
import { ProcessOrderHandler } from "./handlers/process-order.handler";
import { OrderController } from "./controllers/order.controller";
import { StorageModule } from "src/engine/storage/storage.module";
import { WalletModule } from "../wallet/wallet.module";
import { LedgerModule } from "../ledger/ledger.module";
import { ListingModule } from "../listing/listing.module";

@Module({
  imports: [TypeOrmModule.forFeature([Escrow, Order]), StorageModule, WalletModule, LedgerModule, ListingModule],
  controllers: [OrderController,],
  providers: [EscrowService, OrderService, OrderOwnersipService,
    CreateOrderHandler, ProcessOrderHandler
  ],
  exports: [TypeOrmModule]
})
export class MarketModule { }
