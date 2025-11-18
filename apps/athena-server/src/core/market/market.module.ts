import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Escrow } from "./entities/escrow.entity";
import { Listing } from "./entities/listing.entity";
import { Order } from "./entities/order.entity";
import { EscrowService } from "./services/escrow.service";

@Module({
  imports: [TypeOrmModule.forFeature([Escrow, Listing, Order])],
  providers: [EscrowService]
})
export class MarketModule { }
