import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Order } from "../entities/order.entity";
import { DataSource, Entity, Repository } from "typeorm";
import { PurcaseInputDto } from "../dtos/purchase.input";
import { EscrowService } from "./escrow.service";
import { OrderStatus } from "@athena/types";
import { Listing } from "src/core/listing/entities/listing.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private escrowService: EscrowService
  ) {
  }


  async createOrder(dto: PurcaseInputDto) {

    return this.datasource.transaction(async trx => {
      const listing = await trx.getRepository(Listing).findOneByOrFail({ id: dto.listingId });

      const newOrder = trx.create(Order, {
        buyerId: dto.buyerId,
        listingId: dto.listingId,
        amount: listing.price,
        sellerId: listing.ownerId,
        status: OrderStatus.PENDING
      });

      const escrow = await this.escrowService.holdFunds(dto.buyerId, newOrder.id, newOrder.amount);
      newOrder.escrowId = escrow.id;

      return await trx.save(Order, newOrder)


    })
  }

  async processOrder(orderId: string) {

    return this.datasource.transaction(async trx => {
      const repo = trx.getRepository(Order);
      const order = await repo.findOneByOrFail({ id: orderId });

      await this.escrowService.releaseFunds(orderId, order.sellerId);

      await repo.update(orderId, { status: OrderStatus.COMPLETED })
      return await repo.findOneBy({ id: orderId })
    })

  }

  async cancelOrder(orderId: string) {
    return this.datasource.transaction(async trx => {

      const repo = trx.getRepository(Order);
      const order = await repo.findOneByOrFail({ id: orderId });

      await this.escrowService.refundFunds(orderId, order.buyerId)

      await repo.update(orderId, { status: OrderStatus.CANCELLED })

      return await repo.findOneBy({ id: orderId })

    })
  }


}
