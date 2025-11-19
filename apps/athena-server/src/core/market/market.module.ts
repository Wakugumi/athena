import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Escrow } from "./entities/escrow.entity";
import { Listing } from "./entities/listing.entity";
import { Order } from "./entities/order.entity";
import { EscrowService } from "./services/escrow.service";
import { ListingService } from "./services/listing.service";
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
import { ListingItem } from "./entities/listing-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Escrow, Listing, Order, ListingItem]), StorageModule, WalletModule, LedgerModule],
  controllers: [OrderController, ListingController],
  providers: [EscrowService, ListingService, OrderService, OrderOwnersipService,
    CreateDraftListingHandler, CreateOrderHandler, ProcessOrderHandler, PublishListingHandler, SearchListingHandler, UpdateDraftListingHandler, UploadFileListingHandler
  ],
  exports: [TypeOrmModule]
})
export class MarketModule { }
