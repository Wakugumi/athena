import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../entities/order.entity";
import { OrderException, OrderExceptionCode } from "../exceptions/order.exception";
import { Listing } from "../entities/listing.entity";
import { HttpStatus } from "@nestjs/common";

export class OrderOwnersipService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Listing) private readonly listingRepo: Repository<Listing>
  ) {
  }

  /**
  * Return false if the seller given is not associated with the order.
  *
  * Use case example:
  * A request to process the order, but the subject is not the seller, throws error
  */
  async ensureSellerOwns(orderId: string, sellerId: string) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) throw new OrderException('Order not exist', OrderExceptionCode.ORDER_NOT_EXIST);

    const listing = await this.listingRepo.findOneBy({ id: order.listingId })
    if (!listing) throw new OrderException('Listing not exist', OrderExceptionCode.LISTING_NOT_FOUND);

    if (listing.sellerId !== sellerId) throw new OrderException('Seller is not matched to this order', OrderExceptionCode.LISTING_OWNER_MISMATCH, "User is not authorized to run process this order", HttpStatus.UNAUTHORIZED);

  }


  async ensureBuyerOwn(orderId: string, buyerId: string) {

  }
}
