import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Escrow } from "./entities/escrow.entity";
import { Order } from "./entities/order.entity";
import { EscrowService } from "./services/escrow.service";
import { OrderService } from "./services/order.service";
import { OrderOwnersipService } from "./services/order-ownership.service";
import { CreateDraftListingHandler } from "./handlers/create-draft-listing.handler";
import { CreateOrderHandler } from "./handlers/create-order.handler";
import { ProcessOrderHandler } from "./handlers/process-order.handler";
import { PublishListingHandler } from "./handlers/publish-listing.handler";
import { SearchListingHandler } from "./handlers/search-listing.handler";
import { UpdateDraftListingHandler } from "./handlers/update-draft-listing.handler";
import { UploadFileListingHandler } from "./handlers/upload-file.listing.handler";
import { OrderController } from "./controllers/order.controller";
import { ListingController } from "./controllers/listing.controller";
import { StorageModule } from "src/engine/storage/storage.module";
import { WalletModule } from "../wallet/wallet.module";
import { LedgerModule } from "../ledger/ledger.module";
import { FetchDraftListingsHandler } from "./handlers/fetch-draft-listings.handler";

@Module({
  imports: [TypeOrmModule.forFeature([Escrow, Order]), StorageModule, WalletModule, LedgerModule],
  controllers: [OrderController, ListingController],
  providers: [EscrowService, OrderService, OrderOwnersipService,
    CreateDraftListingHandler, CreateOrderHandler, ProcessOrderHandler, PublishListingHandler, SearchListingHandler, UpdateDraftListingHandler, UploadFileListingHandler, ListingStorageSubscriber, FetchDraftListingsHandler
  ],
  exports: [TypeOrmModule]
})
export class MarketModule { }
