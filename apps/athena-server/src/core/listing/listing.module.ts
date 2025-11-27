import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Listing } from "./entities/listing.entity";
import { ListingItem } from "./entities/listing-item.entity";
import { ListingService } from "./services/listing.service";
import { StorageModule } from "src/engine/storage/storage.module";
import { FetchListingsHandler } from "./queries/handlers/fetch-listings.handler";
import { SearchListingHandler } from "./queries/handlers/search-listing.handler";
import { PublishListingHandler } from "./commands/handlers/publish-listing.handler";
import { UpdateDraftListingHandler } from "./commands/handlers/update-draft-listing.handler";
import { DraftListingHandler } from "./commands/handlers/draft-listing.handler";
import { ListingController } from "./listing.controller";
import { UploadFileListingHandler } from "./commands/handlers/upload-file.listing.handler";
import { ListingStorageSubscriber } from "./events/subscribers/listing-storage.subscriber";
import { ListingSubscriber } from "./events/subscribers/listing.subscriber";

@Module({
  imports: [TypeOrmModule.forFeature([Listing, ListingItem]), StorageModule],
  providers: [ListingService, FetchListingsHandler, SearchListingHandler, PublishListingHandler, UpdateDraftListingHandler, DraftListingHandler, UploadFileListingHandler, ListingStorageSubscriber, ListingSubscriber],
  controllers: [ListingController],
  exports: [TypeOrmModule, ListingService]
})
export class ListingModule {
}
