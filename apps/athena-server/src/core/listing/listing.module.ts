import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Listing } from "./entities/listing.entity";
import { ListingItem } from "./entities/listing-item.entity";
import { ListingService } from "./services/listing.service";
import { StorageModule } from "src/engine/storage/storage.module";

@Module({
  imports: [TypeOrmModule.forFeature([Listing, ListingItem]), StorageModule],
  providers: [ListingService],
  exports: [TypeOrmModule, ListingService]
})
export class ListingModule {
}
